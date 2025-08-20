import ballerina/http;

import ballerina/jwt;
import ballerina/log;
import ballerina/sql;

// Shared validator config (HS256) matching the issuer side in generateJwt()
final jwt:ValidatorConfig validatorConfig = { 
    audience: "VConnectClient",
    issuer: "VConnectAPI",
    // For HS256 validation just provide the shared secret
    signatureConfig: { secret: JWT_SECRET }
};

function validateAuth(http:Request req, http:Caller caller) returns error? {
    string authHeader = check req.getHeader("Authorization");
    if !authHeader.startsWith("Bearer ") {
        http:Response r = new;
        r.statusCode = http:STATUS_UNAUTHORIZED;
        r.setJsonPayload({"error": "Missing Bearer token"});
        _ = check caller->respond(r);
        return ();
    }
    string jwtToken = authHeader.substring(7);
    jwt:Payload|jwt:Error v = jwt:validate(jwtToken, validatorConfig);
    if v is jwt:Error {
        log:printError("JWT validation failed", 'error = v);
        http:Response r = new;
        r.statusCode = http:STATUS_UNAUTHORIZED;
        r.setJsonPayload({"error": v.message()});
        _ = check caller->respond(r);
    }
    return ();
}

// Ensure caller is the target organization (matching orgId) or an admin.
function ensureOrgOrAdmin(http:Request req, int orgId) returns error? {
    string authHeader = check req.getHeader("Authorization");
    if !authHeader.startsWith("Bearer ") { return error("Unauthorized", message = "Missing Bearer token"); }
    string jwtToken = authHeader.substring(7);
    jwt:Payload|jwt:Error v = jwt:validate(jwtToken, validatorConfig);
    if v is jwt:Error { return error("Unauthorized", message = v.message()); }
    jwt:Payload payload = <jwt:Payload>v;
    anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"];
    int callerId = -1;
    if idJ is int { callerId = idJ; }
    else if idJ is string { int|error parsed = 'int:fromString(idJ); if parsed is int { callerId = parsed; } }
    if !(typeJ is string) { return error("Forbidden", message = "Invalid user type"); }
    if typeJ == "admin" { return (); }
    if typeJ == "organization" && callerId == orgId { return (); }
    return error("Forbidden", message = "Organization ownership or admin required");
}

listener http:Listener mainListener = new (9000);

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173"],
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        // allow all common request headers from browsers (incl. Authorization)
        allowHeaders: ["*"],
        // if you use cookies/auth headers and need them sent
        allowCredentials: true,
        // optional but nice: cache preflight for a day
        maxAge: 86400,
        // optional: expose headers you return (e.g., Location)
        exposeHeaders: ["Location", "Content-Length"]
    }
}
service /api/org on mainListener {
    // Organization updates the status of a volunteer's application for their event
    resource function patch events/[int event_id]/applications/[int application_id]/status(http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        // Check that the caller is the organization that owns the event or admin
        int owningOrg = -1;
        {
            stream<record {| int oid; |}, sql:Error?> es = dbClient->query(`SELECT organization_id AS oid FROM events WHERE event_id = ${event_id}`);
            record {| record {| int oid; |} value; |}|sql:Error? en = es.next();
            sql:Error? ec = es.close(); if ec is error { return ec; }
            if en is record {| record {| int oid; |} value; |} { owningOrg = en.value.oid; }
            else { http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": "Event not found"}); return caller->respond(r); }
        }
        string authHeader = "";
        {
            string|error h = req.getHeader("Authorization");
            if h is string { authHeader = h; }
        }
        string token = authHeader.substring(7);
        jwt:Payload|jwt:Error pv = jwt:validate(token, validatorConfig);
        if pv is jwt:Error { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": pv.message()}); return caller->respond(r); }
        jwt:Payload payload = <jwt:Payload>pv;
        anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"]; int callerOrg = -1;
        if idJ is int { callerOrg = idJ; } else if idJ is string { int|error p = 'int:fromString(idJ); if p is int { callerOrg = p; } }
        boolean allowed = false;
        if typeJ is string {
            if typeJ == "admin" { allowed = true; }
            else if typeJ == "organization" && callerOrg == owningOrg { allowed = true; }
        }
        if !allowed { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Organization ownership or admin required"}); return caller->respond(r); }
        string newStatus = req.getQueryParamValue("status") ?: "pending";
        EventApplication|error app = updateEventApplicationStatus(application_id, newStatus);
        if app is EventApplication { return caller->respond(app); }
        http:Response r = new; string msg = (<error>app).message(); r.statusCode = msg == "Application not found" ? http:STATUS_NOT_FOUND : http:STATUS_BAD_REQUEST; r.setJsonPayload({"error": msg}); return caller->respond(r);
    }

    resource function get profile/[int id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
    if vErr is error { return; }
    error? ownErr = ensureOrgOrAdmin(req, id);
    if ownErr is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>ownErr).message()}); return caller->respond(r); }
        // Auto-create if missing
        OrgProfile|error p = ensureOrgProfile(id);
        if p is OrgProfile {
            OrgEvent[] evts = [];
            OrgEvent[]|error evRes = getOrgEvents(id);
            if evRes is OrgEvent[] { evts = evRes; }
            json resp = {
                organization_id: p.organization_id,
                description: p.description,
                address: p.address,
                website: p.website,
                is_verified: p.is_verified,
                events: evts
            };
            return caller->respond(resp);
        }
        string msg = (<error>p).message();
        http:Response r = new; r.statusCode = http:STATUS_INTERNAL_SERVER_ERROR; r.setJsonPayload({"error": msg});
        return caller->respond(r);
    }
    resource function post profile(OrgProfile body, http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
        if vErr is error { return; }
        // body.organization_id MUST match caller org id unless caller is admin
        if body.organization_id is int {
            error? ownErr = ensureOrgOrAdmin(req, <int>body.organization_id);
            if ownErr is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>ownErr).message()}); return caller->respond(r); }
        }
        string|error res = createOrgProfile(body);
        if res is string { return caller->respond({message: res}); }
        http:Response r = new;
        r.statusCode = http:STATUS_BAD_REQUEST;
        r.setJsonPayload({"error": res.message()});
        return caller->respond(r);
    }
    resource function put profile/[int id](OrgProfile body, http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
        if vErr is error { return; }
        error? ownErr = ensureOrgOrAdmin(req, id);
        if ownErr is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>ownErr).message()}); return caller->respond(r); }
        string updated = check updateOrgProfile(id, body);
        check caller->respond({ message: updated });
    }

    // Convenience: get my own organization profile using token (no id guesswork) with auto-create
    resource function get profile/self(http:Caller caller, http:Request req) returns error? {
        // Validate token & extract org id
        string authHeader = "";
        {
            string|error h = req.getHeader("Authorization");
            if h is string { authHeader = h; }
        }
        if !authHeader.startsWith("Bearer ") { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": "Missing Bearer token"}); return caller->respond(r); }
        string token = authHeader.substring(7);
        jwt:Payload|jwt:Error pv = jwt:validate(token, validatorConfig);
        if pv is jwt:Error { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": pv.message()}); return caller->respond(r); }
        jwt:Payload payload = <jwt:Payload>pv;
        anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"];
        int orgId = -1;
        if idJ is int { orgId = idJ; }
        else if idJ is string { int|error parsed = 'int:fromString(idJ); if parsed is int { orgId = parsed; } }
        if !(typeJ is string) || typeJ != "organization" || orgId < 0 { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Organization access required"}); return caller->respond(r); }
        OrgProfile|error p = ensureOrgProfile(orgId);
        if p is OrgProfile {
            OrgEvent[] evts = [];
            OrgEvent[]|error evRes = getOrgEvents(orgId);
            if evRes is OrgEvent[] { evts = evRes; }
            json resp = {
                organization_id: p.organization_id,
                description: p.description,
                address: p.address,
                website: p.website,
                is_verified: p.is_verified,
                events: evts
            };
            return caller->respond(resp);
        }
    http:Response r = new; r.statusCode = http:STATUS_INTERNAL_SERVER_ERROR; r.setJsonPayload({"error": (<error>p).message()}); return caller->respond(r);
    }

    resource function get events(http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
        if vErr is error { return; }
        stream<OrgEvent, sql:Error?> eventStream = dbClient->query(`SELECT * FROM events`);
        OrgEvent[] events = [];
        error? e = eventStream.forEach(function(OrgEvent event) {
            events.push(event);
        });
        if e is error {
            http:Response r = new;
            r.statusCode = http:STATUS_INTERNAL_SERVER_ERROR;
            r.setJsonPayload({"error": e.message()});
            return caller->respond(r);
        }
        check caller->respond(events);
    }
    
    resource function get events/[int organization_id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
        if vErr is error { return; }
        OrgEvent[] events = check getOrgEvents(organization_id);
        check caller->respond(events);
    }
    resource function post events(EventCreateRequest body, http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
        if vErr is error { return; }
        OrgEvent created = check createOrgEvent(body);
        check caller->respond(created);
    }
    resource function put events/[int event_id](EventCreateRequest body, http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
        if vErr is error { return; }
        OrgEvent updated = check updateOrgEvent(event_id, body);
        check caller->respond(updated);
    }
    resource function delete events/[int event_id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
        if vErr is error { return; }
        string msg = check deleteOrgEvent(event_id);
        check caller->respond({message: msg});
    }
    
    // Handle volunteer application to events
    resource function post events/[int event_id]/apply(http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
        if vErr is error { return; }
        // Extract volunteer ID from token
        string authHeader = check req.getHeader("Authorization");
        string token = authHeader.substring(7);
        jwt:Payload payload = check jwt:validate(token, validatorConfig);
        anydata? uidJson = payload["user_id"];
        anydata? typeJson = payload["user_type"];
        
        if !(typeJson is string) || typeJson != "volunteer" {
            http:Response r = new;
            r.statusCode = http:STATUS_FORBIDDEN;
            r.setJsonPayload({"error": "Volunteer access required"});
            return caller->respond(r);
        }
        
        int vid;
        if uidJson is int {
            vid = uidJson;
        } else if uidJson is string {
            vid = check 'int:fromString(uidJson);
        } else {
            http:Response r = new;
            r.statusCode = http:STATUS_BAD_REQUEST;
            r.setJsonPayload({"error": "Invalid user_id"});
            return caller->respond(r);
        }
        
        EventApplication app = check createEventApplication(vid, event_id);
        return caller->respond(app);
    }

    resource function get donations/[int id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller);
        if vErr is error { return; }
        OrgDonation[] donations = check getOrgDonations(id);
        check caller->respond(donations);
    }

    // Donation Requests
    resource function post donation_requests(DonationRequest body, http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        DonationRequest created = check createDonationRequest(body);
        check caller->respond(created);
    }
        resource function get donation_requests/org/[int organization_id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        DonationRequest[] list = check listDonationRequests(organization_id);
        check caller->respond(list);
    }
    resource function get donation_requests/[int request_id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        DonationRequest|error dr = getDonationRequest(request_id);
        if dr is DonationRequest { return caller->respond(dr); }
        http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>dr).message()});
        return caller->respond(r);
    }
    resource function put donation_requests/[int request_id](DonationRequestUpdate body, http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        DonationRequest|error dr = updateDonationRequest(request_id, body);
        if dr is DonationRequest { return caller->respond(dr); }
        error e = <error>dr; string msg = e.message();
        int status = http:STATUS_INTERNAL_SERVER_ERROR;
    if msg == "No fields updated or donation request not found" { status = http:STATUS_NOT_FOUND; }
    else if msg.indexOf("cannot be empty") >= 0 || msg.indexOf("must be >= 0") >= 0 || msg == "requestId required" { status = http:STATUS_BAD_REQUEST; }
        http:Response r = new; r.statusCode = status; r.setJsonPayload({"error": msg});
        return caller->respond(r);
    }
    resource function delete donation_requests/[int request_id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        string|error res = deleteDonationRequest(request_id);
        if res is string { return caller->respond({ message: res }); }
        http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>res).message()});
        return caller->respond(r);
    }

    // Feedback
    resource function post feedback(Feedback body, http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        Feedback|error created = createFeedback(body);
        if created is Feedback {
            return caller->respond(created);
        }
        error e = <error>created;
        string msg = e.message();
    string reason = msg;
        int status = http:STATUS_INTERNAL_SERVER_ERROR;
        if msg == "event_id required" || msg == "volunteer_id required" ||
            msg == "organization_id required" || msg == "rating must be 1-5" {
            status = http:STATUS_BAD_REQUEST;
        } else if msg == "Event not found" || msg == "Volunteer not found" || msg == "Organization not found" {
            status = http:STATUS_NOT_FOUND;
        } else if msg == "Feedback already submitted for this event by volunteer" {
            status = http:STATUS_CONFLICT;
        }
        http:Response r = new;
        r.statusCode = status;
        r.setJsonPayload({"error": msg, "detail": reason});
        return caller->respond(r);
    }
    resource function get feedback/event/[int event_id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        Feedback[] list = check listFeedbackByEvent(event_id);
        check caller->respond(list);
    }
    resource function get feedback/org/[int organization_id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        Feedback[] list = check listFeedbackByOrg(organization_id);
        check caller->respond(list);
    }
    resource function get feedback/[int feedback_id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        Feedback|error fb = getFeedback(feedback_id);
        if fb is Feedback { return caller->respond(fb); }
        http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>fb).message()});
        return caller->respond(r);
    }
    resource function put feedback/[int feedback_id](FeedbackUpdate upd, http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        Feedback|error tmp = updateFeedback(feedback_id, upd);
        if tmp is Feedback { return caller->respond(tmp); }
        string msg = (<error>tmp).message();
        int status = http:STATUS_INTERNAL_SERVER_ERROR;
        if msg == "No fields updated or feedback not found" { status = http:STATUS_NOT_FOUND; }
        else if msg == "rating must be 1-5" { status = http:STATUS_BAD_REQUEST; }
        http:Response r = new;
        r.statusCode = status;
        r.setJsonPayload({ "error": msg });
        return caller->respond(r);
    }
    resource function delete feedback/[int feedback_id](http:Caller caller, http:Request req) returns error? {
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        string|error del = deleteFeedback(feedback_id);
        if del is string { return caller->respond({ message: del }); }
        http:Response r = new;
        r.statusCode = http:STATUS_NOT_FOUND;
        r.setJsonPayload({ "error": (<error>del).message() });
        return caller->respond(r);
    }

    // List applications for an event (organization view)
    resource function get events/[int event_id]/applications(http:Caller caller, http:Request req) returns error? {
        // Auth then ensure caller is owning organization of the event OR admin
        error? vErr = validateAuth(req, caller); if vErr is error { return; }
        // Fetch event's organization_id
        int owningOrg = -1;
        {
            stream<record {| int oid; |}, sql:Error?> es = dbClient->query(`SELECT organization_id AS oid FROM events WHERE event_id = ${event_id}`);
            record {| record {| int oid; |} value; |}|sql:Error? en = es.next();
            sql:Error? ec = es.close(); if ec is error { return ec; }
            if en is record {| record {| int oid; |} value; |} { owningOrg = en.value.oid; }
            else { http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": "Event not found"}); return caller->respond(r); }
        }
        // Extract token to check role/org
        string authHeader = "";
        {
            string|error h = req.getHeader("Authorization");
            if h is string { authHeader = h; }
        }
        string token = authHeader.substring(7);
        jwt:Payload|jwt:Error pv = jwt:validate(token, validatorConfig);
        if pv is jwt:Error { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": pv.message()}); return caller->respond(r); }
        jwt:Payload payload = <jwt:Payload>pv;
        anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"]; int callerOrg = -1;
        if idJ is int { callerOrg = idJ; } else if idJ is string { int|error p = 'int:fromString(idJ); if p is int { callerOrg = p; } }
        boolean allowed = false;
        if typeJ is string {
            if typeJ == "admin" { allowed = true; }
            else if typeJ == "organization" && callerOrg == owningOrg { allowed = true; }
        }
        if !allowed { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Organization ownership or admin required"}); return caller->respond(r); }
        EventApplication[] list = check listEventApplicationsForEvent(event_id);
        return caller->respond(list);
    }

    // Badge CRUD via organization removed; badges now awarded automatically or via admin endpoints.
}

// Volunteer self-service (authenticated volunteer can view own badges)
@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"],
        allowCredentials: false,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowHeaders: ["*"]
    }
}
service /api/vol on mainListener {
    resource function get badges(http:Caller caller, http:Request req) returns error? {
        string authHeader = check req.getHeader("Authorization");
        if !authHeader.startsWith("Bearer ") {
            http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": "Missing Bearer token"});
            return caller->respond(r);
        }
        string jwtToken = authHeader.substring(7);
    jwt:Payload|jwt:Error val = jwt:validate(jwtToken, validatorConfig);
    if val is jwt:Error {
            http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": val.message()});
            return caller->respond(r);
        }
    // Access custom claims directly from payload rest fields
    jwt:Payload payload = <jwt:Payload>val;
    anydata? uidJson = payload["user_id"]; anydata? typeJson = payload["user_type"]; 
    if !(typeJson is string) || typeJson != "volunteer" || uidJson is () { 
            http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Volunteer access required"});
            return caller->respond(r);
        }
        int vid;
        if uidJson is int { vid = uidJson; }
        else if uidJson is string {
            int|error parsed = 'int:fromString(uidJson);
            if parsed is error { http:Response r = new; r.statusCode = http:STATUS_BAD_REQUEST; r.setJsonPayload({"error": "Invalid user_id claim"}); return caller->respond(r); }
            vid = <int>parsed;
        } else {
            http:Response r = new; r.statusCode = http:STATUS_BAD_REQUEST; r.setJsonPayload({"error": "Unsupported user_id claim type"}); return caller->respond(r);
        }
        Badge[] list = check listBadgesForVolunteer(vid);
        return caller->respond(list);
    }

    // Volunteer applies to an event (must be active). Table 'event_applications' assumed with columns (application_id auto?, volunteer_id, event_id, applied_at default CURRENT_TIMESTAMP)
    resource function post events/[int event_id]/apply(http:Caller caller, http:Request req) returns error? {
        string authHeader = check req.getHeader("Authorization");
        if !authHeader.startsWith("Bearer ") {
            http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": "Missing Bearer token"});
            return caller->respond(r);
        }
        string jwtToken = authHeader.substring(7);
        jwt:Payload|jwt:Error val = jwt:validate(jwtToken, validatorConfig);
        if val is jwt:Error {
            http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": val.message()});
            return caller->respond(r);
        }
        jwt:Payload payload = <jwt:Payload>val;
        anydata? uidJson = payload["user_id"]; anydata? typeJson = payload["user_type"]; 
        if !(typeJson is string) || typeJson != "volunteer" || uidJson is () { 
            http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Volunteer access required"});
            return caller->respond(r);
        }
        int vid;
        if uidJson is int { vid = uidJson; }
        else if uidJson is string {
            int|error parsed = 'int:fromString(uidJson);
            if parsed is error { http:Response r = new; r.statusCode = http:STATUS_BAD_REQUEST; r.setJsonPayload({"error": "Invalid user_id claim"}); return caller->respond(r); }
            vid = <int>parsed;
        } else { http:Response r = new; r.statusCode = http:STATUS_BAD_REQUEST; r.setJsonPayload({"error": "Unsupported user_id claim type"}); return caller->respond(r); }
        // Check volunteer active
        stream<record {| boolean? is_active; |}, sql:Error?> vs = dbClient->query(`SELECT is_active FROM users WHERE user_id = ${vid}`);
        record {| record {| boolean? is_active; |} value; |}|sql:Error? vn = vs.next();
        sql:Error? vClose = vs.close(); if vClose is error { return vClose; }
        if !(vn is record {| record {| boolean? is_active; |} value; |}) { http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": "Volunteer not found"}); return caller->respond(r); }
        boolean active = vn.value.is_active ?: false;
        if !active { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Volunteer inactive"}); return caller->respond(r); }
        // Check event exists
        stream<record {| int eid; |}, sql:Error?> es = dbClient->query(`SELECT event_id as eid FROM events WHERE event_id = ${event_id}`);
        record {| record {| int eid; |} value; |}|sql:Error? en = es.next();
        sql:Error? eClose = es.close(); if eClose is error { return eClose; }
        if !(en is record {| record {| int eid; |} value; |}) { http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": "Event not found"}); return caller->respond(r); }
    // Create or fetch existing application and return it
    EventApplication|error app = createEventApplication(vid, event_id);
    if app is EventApplication { return caller->respond(app); }
    error e = <error>app;
    string msg = e.message();
    string detailed = msg;
    // e.detail() returns a readonly map; just attempt to read common key names safely
    anydata d = <anydata>e.detail();
    if d is map<anydata> { anydata? dm = d["message"]; if dm is string { detailed = dm; } }
    int sc = http:STATUS_INTERNAL_SERVER_ERROR;
    if detailed == "Event not found" || detailed == "Volunteer not found" || detailed == "Application not found" { sc = http:STATUS_NOT_FOUND; }
    http:Response r = new; r.statusCode = sc; r.setJsonPayload({"error": detailed});
    return caller->respond(r);
    }

    // List my event applications
    resource function get applications(http:Caller caller, http:Request req) returns error? {
        string authHeader = check req.getHeader("Authorization"); if !authHeader.startsWith("Bearer ") { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": "Missing Bearer token"}); return caller->respond(r); }
        jwt:Payload|jwt:Error val = jwt:validate(authHeader.substring(7), validatorConfig); if val is jwt:Error { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": val.message()}); return caller->respond(r); }
        jwt:Payload payload = <jwt:Payload>val; anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"]; int vid = -1; if idJ is int { vid = idJ; } else if idJ is string { int|error p = 'int:fromString(idJ); if p is int { vid = p; } }
        if !(typeJ is string) || typeJ != "volunteer" || vid < 0 { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Volunteer access required"}); return caller->respond(r); }
        EventApplication[] list = check listEventApplicationsForVolunteer(vid);
        return caller->respond(list);
    }

    // Withdraw my application for an event
    resource function delete events/[int event_id]/apply(http:Caller caller, http:Request req) returns error? {
        string authHeader = check req.getHeader("Authorization"); if !authHeader.startsWith("Bearer ") { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": "Missing Bearer token"}); return caller->respond(r); }
        jwt:Payload|jwt:Error val = jwt:validate(authHeader.substring(7), validatorConfig); if val is jwt:Error { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": val.message()}); return caller->respond(r); }
        jwt:Payload payload = <jwt:Payload>val; anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"]; int vid = -1; if idJ is int { vid = idJ; } else if idJ is string { int|error p = 'int:fromString(idJ); if p is int { vid = p; } }
        if !(typeJ is string) || typeJ != "volunteer" || vid < 0 { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Volunteer access required"}); return caller->respond(r); }
        string|error res = deleteEventApplicationByVolunteer(vid, event_id);
        if res is string { return caller->respond({message: res}); }
        http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>res).message()}); return caller->respond(r);
    }
}
// Public volunteer profile + ranking (shares same module globals; add auth later if needed)
service /api/volunteers on mainListener {
    // Get volunteer profile
    resource function get[int id](http:Caller caller, http:Request req) returns error? {
    // Require token and ownership
        string authHeader = "";
        {
            string|error h = req.getHeader("Authorization");
            if h is string { authHeader = h; }
        }
    if !authHeader.startsWith("Bearer ") { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": "Missing Bearer token"}); return caller->respond(r); }
    string token = authHeader.substring(7);
    jwt:Payload|jwt:Error pv = jwt:validate(token, validatorConfig);
    if pv is jwt:Error { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": pv.message()}); return caller->respond(r); }
    jwt:Payload payload = <jwt:Payload>pv;
    anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"];
    int callerId = -1;
    if idJ is int { callerId = idJ; }
    else if idJ is string { int|error parsed = 'int:fromString(idJ); if parsed is int { callerId = parsed; } }
    if !(typeJ is string) || typeJ != "volunteer" || callerId != id { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Volunteer ownership required"}); return caller->respond(r); }
    VolunteerProfile|error p = fetchVolunteerProfile(id);
    if p is VolunteerProfile { return caller->respond(p); }
    http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>p).message()}); return caller->respond(r);
    }
    // Update volunteer profile (bio, skills) - no auth yet
    resource function put [int id](VolunteerProfileUpdate upd, http:Caller caller, http:Request req) returns error? {
        string authHeader = "";
        {
            string|error h = req.getHeader("Authorization");
            if h is string { authHeader = h; }
        }
    if !authHeader.startsWith("Bearer ") { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": "Missing Bearer token"}); return caller->respond(r); }
    string token = authHeader.substring(7);
    jwt:Payload|jwt:Error pv = jwt:validate(token, validatorConfig);
    if pv is jwt:Error { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": pv.message()}); return caller->respond(r); }
    jwt:Payload payload = <jwt:Payload>pv;
    anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"];
    int callerId = -1; if idJ is int { callerId = idJ; } else if idJ is string { int|error parsed = 'int:fromString(idJ); if parsed is int { callerId = parsed; } }
    if !(typeJ is string) || typeJ != "volunteer" || callerId != id { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Volunteer ownership required"}); return caller->respond(r); }
    VolunteerProfile|error p = upsertVolunteerProfile(id, upd);
    if p is VolunteerProfile { return caller->respond(p); }
    http:Response r = new; r.statusCode = (<error>p).message() == "Volunteer not found" ? http:STATUS_NOT_FOUND : http:STATUS_INTERNAL_SERVER_ERROR; r.setJsonPayload({"error": (<error>p).message()}); return caller->respond(r);
    }
    // Volunteer badges
    resource function get [int id]/badges(http:Caller caller, http:Request req) returns error? {
        string authHeader = "";
        {
            string|error h = req.getHeader("Authorization");
            if h is string { authHeader = h; }
        }
    if !authHeader.startsWith("Bearer ") { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": "Missing Bearer token"}); return caller->respond(r); }
    string token = authHeader.substring(7);
    jwt:Payload|jwt:Error pv = jwt:validate(token, validatorConfig);
    if pv is jwt:Error { http:Response r = new; r.statusCode = http:STATUS_UNAUTHORIZED; r.setJsonPayload({"error": pv.message()}); return caller->respond(r); }
    jwt:Payload payload = <jwt:Payload>pv; anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"];
    int callerId = -1; if idJ is int { callerId = idJ; } else if idJ is string { int|error parsed = 'int:fromString(idJ); if parsed is int { callerId = parsed; } }
    if !(typeJ is string) || typeJ != "volunteer" || callerId != id { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": "Volunteer ownership required"}); return caller->respond(r); }
    VolunteerProfile|error p = fetchVolunteerProfile(id);
    if p is error { http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>p).message()}); return caller->respond(r); }
    Badge[] list = check listBadgesForVolunteer(id);
    return caller->respond(list);
    }
    // Ranking
    resource function get top(http:Caller caller, http:Request req) returns error? {
        string byParam = req.getQueryParamValue("by") ?: "hours";
        if byParam != "hours" && byParam != "rating" { byParam = "hours"; }
        VolunteerRanking[]|error list = computeTopVolunteers(byParam, 10);
        if list is VolunteerRanking[] { return caller->respond(list); }
        http:Response r = new; r.statusCode = http:STATUS_INTERNAL_SERVER_ERROR; r.setJsonPayload({"error": (<error>list).message()}); return caller->respond(r);
    }
}
// Admin service (user_type must be admin)
// Helper to extract and validate admin token, returning admin user id or error
function ensureAdmin(http:Request req) returns int|error {
    string authHeader = check req.getHeader("Authorization");
    if !authHeader.startsWith("Bearer ") { return error("Unauthorized", message = "Missing Bearer token"); }
    string token = authHeader.substring(7);
    jwt:Payload|jwt:Error pv = jwt:validate(token, validatorConfig);
    if pv is jwt:Error { return error("Unauthorized", message = pv.message()); }
    jwt:Payload payload = <jwt:Payload>pv;
    anydata? typeJ = payload["user_type"]; anydata? idJ = payload["user_id"]; 
    if !(typeJ is string) || typeJ != "admin" || idJ is () { return error("Forbidden", message = "Admin access required"); }
    if idJ is int { return idJ; }
    else if idJ is string { int|error parsed = 'int:fromString(idJ); if parsed is error { return error("BadToken", message = "Invalid user_id claim"); } return <int>parsed; }
    return error("BadToken", message = "Unsupported user_id claim type");
}
//---------------------------------------------------------------------
//admin

service /api/admin on mainListener {
    resource function get users(http:Caller caller, http:Request req) returns error? {
        int|error adm = ensureAdmin(req); if adm is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>adm).message()}); return caller->respond(r); }
        UserSummary[] list = check listAllUsers();
        return caller->respond(list);
    }
    resource function patch users/[int id]/status(UserStatusUpdate body, http:Caller caller, http:Request req) returns error? {
        int|error adm = ensureAdmin(req); if adm is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>adm).message()}); return caller->respond(r); }
        string|error res = updateUserStatus(id, body.is_active);
        if res is string { return caller->respond({message: res}); }
        http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>res).message()}); return caller->respond(r);
    }
    resource function delete users/[int id](http:Caller caller, http:Request req) returns error? {
        int|error adm = ensureAdmin(req); if adm is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>adm).message()}); return caller->respond(r); }
        string|error res = deleteUserAccount(id);
        if res is string { return caller->respond({message: res}); }
        http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>res).message()}); return caller->respond(r);
    }
    resource function get events/[int event_id]/contributions(http:Caller caller, http:Request req) returns error? {
        int|error adm = ensureAdmin(req); if adm is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>adm).message()}); return caller->respond(r); }
        VolunteerContribution[] list = check listVolunteerContributionsForEvent(event_id);
        return caller->respond(list);
    }
    // Admin awarding badge (awarded_by automatically set to admin id)
    resource function post badges(BadgeCreate body, http:Caller caller, http:Request req) returns error? {
        int|error adm = ensureAdmin(req); if adm is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>adm).message()}); return caller->respond(r); }
        int adminId = <int>adm;
        BadgeCreate payload = { volunteer_id: body.volunteer_id, badge_name: body.badge_name, badge_description: body.badge_description ?: (), awarded_by: adminId };
        Badge|error b = createBadge(payload);
        if b is Badge { return caller->respond(b); }
        error e = <error>b; string msg = e.message(); int status = http:STATUS_BAD_REQUEST; if msg == "Volunteer not found" { status = http:STATUS_NOT_FOUND; }
        http:Response r = new; r.statusCode = status; r.setJsonPayload({"error": msg}); return caller->respond(r);
    }
    // Recalculate and award performance badges automatically for a volunteer
    resource function post volunteers/[int volunteer_id]/performance_badges(http:Caller caller, http:Request req) returns error? {
        int|error adm = ensureAdmin(req); if adm is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>adm).message()}); return caller->respond(r); }
        int adminId = <int>adm;
        // Ensure volunteer exists
        stream<record {| int vid; |}, sql:Error?> vs = dbClient->query(`SELECT user_id AS vid FROM users WHERE user_id = ${volunteer_id} AND user_type = 'volunteer'`);
        record {| record {| int vid; |} value; |}|sql:Error? vn = vs.next();
        sql:Error? vClose = vs.close(); if vClose is error { return vClose; }
        if !(vn is record {| record {| int vid; |} value; |}) { http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": "Volunteer not found"}); return caller->respond(r); }
        error? ap = ensurePerformanceBadges(volunteer_id, adminId);
        if ap is error { http:Response r = new; r.statusCode = http:STATUS_INTERNAL_SERVER_ERROR; r.setJsonPayload({"error": ap.message()}); return caller->respond(r); }
        // Return updated badges list
        Badge[] list = check listBadgesForVolunteer(volunteer_id);
        return caller->respond(list);
    }

    // Update event application status (?status=approved|rejected|pending)
    resource function patch applications/[int application_id]/status(http:Caller caller, http:Request req) returns error? {
        int|error adm = ensureAdmin(req); if adm is error { http:Response r = new; r.statusCode = http:STATUS_FORBIDDEN; r.setJsonPayload({"error": (<error>adm).message()}); return caller->respond(r); }
        string newStatus = req.getQueryParamValue("status") ?: "pending";
        EventApplication|error app = updateEventApplicationStatus(application_id, newStatus);
        if app is EventApplication { return caller->respond(app); }
        http:Response r = new; string msg = (<error>app).message(); r.statusCode = msg == "Application not found" ? http:STATUS_NOT_FOUND : http:STATUS_BAD_REQUEST; r.setJsonPayload({"error": msg}); return caller->respond(r);
    }
}
//----------------------------------------------------------------
// Public badge viewing service
@http:ServiceConfig {
    cors: {
    allowOrigins: ["http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"]
    }
}
service /pub on mainListener {
    resource function get badges/[int badge_id](http:Caller caller, http:Request req) returns error? {
        Badge|error b = getBadge(badge_id);
        if b is Badge { return caller->respond(b); }
        http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>b).message()});
        return caller->respond(r);
    }
    resource function get badges/volunteer/[int volunteer_id](http:Caller caller, http:Request req) returns error? {
        Badge[] list = check listBadgesForVolunteer(volunteer_id);
        return caller->respond(list);
    }
    // Public donation requests
    resource function get donation_requests/[int request_id](http:Caller caller, http:Request req) returns error? {
        DonationRequest|error dr = getDonationRequest(request_id);
        if dr is DonationRequest { return caller->respond(dr); }
        http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>dr).message()});
        return caller->respond(r);
    }
    resource function get donation_requests/org/[int organization_id](http:Caller caller, http:Request req) returns error? {
        DonationRequest[] list = check listDonationRequests(organization_id);
        return caller->respond(list);
    }
    // Public donations list per organization
    resource function get donations/org/[int organization_id](http:Caller caller, http:Request req) returns error? {
        OrgDonation[] donations = check getOrgDonations(organization_id);
        return caller->respond(donations);
    }
    // Public events
    resource function get events/org/[int organization_id](http:Caller caller, http:Request req) returns error? {
        OrgEvent[] events = check getOrgEvents(organization_id);
        return caller->respond(events);
    }
    // Public: Get all events
    resource function get events(http:Caller caller, http:Request req) returns error? {
        OrgEvent[] events = check getAllEvents();
        return caller->respond(events);
    }
    resource function get events/[int event_id](http:Caller caller, http:Request req) returns error? {
        OrgEvent|error ev = getEvent(event_id);
        if ev is OrgEvent { return caller->respond(ev); }
        http:Response r = new; r.statusCode = http:STATUS_NOT_FOUND; r.setJsonPayload({"error": (<error>ev).message()});
        return caller->respond(r);
    }
}
//---------------------------------------------------------------
service /api/auth on mainListener {
    resource function post register(User user, http:Caller caller) returns error? {
        string|error regResult = registerUser(user);
        if regResult is string { return caller->respond({message: regResult}); }
        http:Response resp = new;
        resp.statusCode = http:STATUS_CONFLICT;
    resp.setJsonPayload({"error": regResult.message()});
        return caller->respond(resp);
    }
    resource function post login(LoginRequest creds, http:Caller caller) returns error? {
        map<anydata>|error loginResult = loginUser(creds);
        if loginResult is map<anydata> { return caller->respond(loginResult); }
        http:Response resp = new;
        resp.statusCode = http:STATUS_UNAUTHORIZED;
    resp.setJsonPayload({"error": loginResult.message()});
        return caller->respond(resp);
    }
}

