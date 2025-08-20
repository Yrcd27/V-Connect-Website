// Get all events (public API helper)

import ballerina/sql;
function getAllEvents() returns OrgEvent[]|error {
    OrgEvent[] events = [];
    stream<OrgEvent, sql:Error?> resultStream = dbClient->query(`SELECT event_id, organization_id, title, description, location, event_date, start_time, end_time, required_volunteers, status, created_at FROM events`);
    while true {
        record {| OrgEvent value; |}|sql:Error? n = resultStream.next();
        if n is record {| OrgEvent value; |} { events.push(n.value); continue; }
        break;
    }
    sql:Error? closeErr = resultStream.close();
    if closeErr is error { return closeErr; }
    return events;
}


type OrgProfile record {| 
    int organization_id?;
    string description;
    string address;
    string website;
    boolean is_verified;
|};

type OrgEvent record {| 
    int event_id?; 
    int organization_id; 
    string title; 
    string description; 
    string? location; 
    string? event_date; 
    string? start_time; 
    string? end_time; 
    int? required_volunteers; 
    string? status; 
    string? created_at?; 
|};

// Request payload for creating an event (eventId optional)
type EventCreateRequest record {| 
    int organization_id?;          // preferred numeric id
    string orgId?;                 // legacy string id
    string title;                  // required
    string description;            // required
    string location?; 
    string event_date?; 
    string start_time?; 
    string end_time?; 
    int required_volunteers?; 
    string status?; 
    string eventId?;               // ignored
|};

type OrgDonation record {| 
    string donationId;
    decimal amount;
    string orgId;
|};

// Donation request table mapping
type DonationRequest record {| 
    int request_id?;                 // auto generated
    int organization_id;             // required
    string title;                    // required
    string description;              // required
    decimal target_amount?;          // optional, only if you want a target
    string contact_info?;            // optional contact details
    string status?;                  // optional; defaults to active if absent
    string created_at?;              // optional (returned from DB)
|};

// Partial update payload for donation request
type DonationRequestUpdate record {|
    string? title;
    string? description;
    decimal? target_amount;
    string? contact_info;
    string? status;
    anydata...; // allow extra untouched fields
|};

// Feedback table mapping
type Feedback record {| 
    int feedback_id?; 
    int event_id; 
    int volunteer_id; 
    int organization_id; 
    int rating; 
    string? comment; 
    int? hours_worked; 
    string? given_at?; 
|};

// Badges table mapping
type Badge record {|
    int badge_id?;
    int volunteer_id;
    string badge_name;
    string? badge_description;
    string? earned_date?;
    int? awarded_by; // organization id
|};

type BadgeCreate record {| 
    int volunteer_id;          // required
    string badge_name;         // required
    string badge_description?; // optional
    int awarded_by?;           // optional org awarding
    anydata...;                // ignore unexpected extra client fields (e.g., badge_id, earned_date)
|};

type BadgeUpdate record {| 
    string badge_name?;
    string badge_description?;
    int awarded_by?;
    anydata...; // allow unexpected fields; only listed ones processed
|};

// Partial update payload for feedback
type FeedbackUpdate record {| 
    int? rating; 
    string? comment; 
    int? hours_worked; 
    anydata...; // allow extra fields (event_id, volunteer_id, etc.) without binding errors
|};

// Typed error for not found scenarios
type NotFoundError error<record { string message; }>;


// Only one DbConfig, mysqlOptions, dbConfig, and dbClient should be declared in this file.


/// Get organization profile by id.
/// @param id organization id
/// @return OrgProfile or error

function getOrgProfile(int id) returns OrgProfile|error {
    stream<OrgProfile, sql:Error?> s = dbClient->query(`SELECT organization_id, description, address, website, is_verified FROM organization_profiles WHERE organization_id = ${id}`);
    record {| OrgProfile value; |}|sql:Error? n = s.next();
    sql:Error? closeErr = s.close();
    if closeErr is error { return closeErr; }
    if n is record {| OrgProfile value; |} { return n.value; }
    return error NotFoundError("NOT_FOUND", message = "Organization profile not found");
}

// Ensure an organization profile exists; if not, create a minimal empty one and return it.
function ensureOrgProfile(int orgId) returns OrgProfile|error {
    OrgProfile|error p = getOrgProfile(orgId);
    if p is OrgProfile { return p; }
    // Only auto-create if the error is the standard NOT_FOUND
    string msg = (<error>p).message();
    if msg != "Organization profile not found" && msg != "NOT_FOUND" { return p; }
    sql:ExecutionResult r = check dbClient->execute(`INSERT INTO organization_profiles (organization_id, description, address, website, is_verified)
            VALUES (${orgId}, '', '', '', false)`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { return getOrgProfile(orgId); }
    return error("DBError", message = "Auto-create organization profile failed");
}
    function createOrgProfile(OrgProfile profile) returns string|error {
        if profile.organization_id is () { return error("organization_id required"); }
        // Check existing
        stream<OrgProfile, sql:Error?> s = dbClient->query(`SELECT organization_id, description, address, website, is_verified FROM organization_profiles WHERE organization_id = ${profile.organization_id}`);
        record {| OrgProfile value; |}|sql:Error? n = s.next();
        sql:Error? closeErr = s.close();
        if closeErr is error { return closeErr; }
        if n is record {| OrgProfile value; |} { return error("Profile already exists"); }
        sql:ExecutionResult r = check dbClient->execute(`INSERT INTO organization_profiles (organization_id, description, address, website, is_verified)
            VALUES (${profile.organization_id}, ${profile.description}, ${profile.address}, ${profile.website}, ${profile.is_verified})`);
        if r.affectedRowCount is int && r.affectedRowCount > 0 { return "Created"; }
        return error("Create failed");
    }

function updateOrgProfile(int id, OrgProfile body) returns string|error {
    sql:ExecutionResult result = check dbClient->execute(`UPDATE organization_profiles SET
            description = ${body.description},
            address = ${body.address},
            website = ${body.website},
            is_verified = ${body.is_verified}
        WHERE organization_id = ${id}`);
    if result.affectedRowCount is int && result.affectedRowCount > 0 { return "Updated Successfully."; }
    return error("OrgError", message = "Update failed or no rows affected");
}

function getOrgEvents(int orgId) returns OrgEvent[]|error {
    OrgEvent[] events = [];
    stream<OrgEvent, sql:Error?> resultStream = dbClient->query(`SELECT event_id, organization_id, title, description, location,
            event_date, start_time, end_time, required_volunteers, status, created_at
        FROM events WHERE organization_id = ${orgId}`);
    while true {
        record {| OrgEvent value; |}|sql:Error? n = resultStream.next();
        if n is record {| OrgEvent value; |} { events.push(n.value); continue; }
        break;
    }
    sql:Error? closeErr = resultStream.close();
    if closeErr is error { return closeErr; }
    return events;
}

function getEvent(int eventId) returns OrgEvent|error {
    if eventId <= 0 { return error("ValidationError", message = "eventId required"); }
    stream<OrgEvent, sql:Error?> s = dbClient->query(`SELECT event_id, organization_id, title, description, location,
            event_date, start_time, end_time, required_volunteers, status, created_at FROM events WHERE event_id = ${eventId}`);
    record {| OrgEvent value; |}|sql:Error? n = s.next();
    sql:Error? cerr = s.close();
    if cerr is error { return cerr; }
    if n is record {| OrgEvent value; |} { return n.value; }
    return error("NotFound", message = "Event not found");
}

function createOrgEvent(EventCreateRequest event) returns OrgEvent|error {
    string title = event.title.trim();
    if title == "" { return error("ValidationError", message = "title required"); }
    string desc = event.description.trim();
    if desc == "" { return error("ValidationError", message = "description required"); }
    int orgIdVal;
    if event.organization_id is int { orgIdVal = <int>event.organization_id; }
    else if event.orgId is string {
        int|error parsed = 'int:fromString(event.orgId ?: "");
        if parsed is error { return error("ValidationError", message = "orgId must be integer"); }
        orgIdVal = <int>parsed;
    } else { return error("ValidationError", message = "organization_id or orgId required"); }
    string status = (event.status is string && (<string>event.status).trim() != "") ? (<string>event.status) : "active";
    sql:ExecutionResult res = check dbClient->execute(`INSERT INTO events 
            (organization_id, title, description, location, event_date, start_time, end_time, required_volunteers, status)
    VALUES (${orgIdVal}, ${title}, ${desc}, ${event.location ?: ()}, ${event.event_date ?: ()},
        ${event.start_time ?: ()}, ${event.end_time ?: ()}, ${event.required_volunteers ?: ()}, ${status})`);
    if res.affectedRowCount is int && res.affectedRowCount > 0 {
        int newId = <int>res.lastInsertId;
        // Fetch created row (optional) else build record from input
        stream<OrgEvent, sql:Error?> s = dbClient->query(`SELECT event_id, organization_id, title, description, location,
                event_date, start_time, end_time, required_volunteers, status, created_at
            FROM events WHERE event_id = ${newId}`);
        record {| OrgEvent value; |}|sql:Error? n = s.next();
        sql:Error? _close = s.close();
        if n is record {| OrgEvent value; |} { return n.value; }
        return { event_id: newId, organization_id: orgIdVal, title: title, description: desc,
            location: event.location ?: (), event_date: event.event_date ?: (), start_time: event.start_time ?: (), end_time: event.end_time ?: (),
            required_volunteers: event.required_volunteers ?: (), status: status, created_at: () };
    }
    return error("DBError", message = "Insert reported 0 rows");
}

function updateOrgEvent(int eventId, EventCreateRequest changes) returns OrgEvent|error {
    boolean updatedAny = false;
    if changes.title is string {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE events SET title = ${changes.title} WHERE event_id = ${eventId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { updatedAny = true; }
    }
    if changes.description is string {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE events SET description = ${changes.description} WHERE event_id = ${eventId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { updatedAny = true; }
    }
    if changes.location is string {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE events SET location = ${changes.location} WHERE event_id = ${eventId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { updatedAny = true; }
    }
    if changes.event_date is string {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE events SET event_date = ${changes.event_date} WHERE event_id = ${eventId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { updatedAny = true; }
    }
    if changes.start_time is string {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE events SET start_time = ${changes.start_time} WHERE event_id = ${eventId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { updatedAny = true; }
    }
    if changes.end_time is string {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE events SET end_time = ${changes.end_time} WHERE event_id = ${eventId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { updatedAny = true; }
    }
    if changes.required_volunteers is int {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE events SET required_volunteers = ${changes.required_volunteers} WHERE event_id = ${eventId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { updatedAny = true; }
    }
    if changes.status is string {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE events SET status = ${changes.status} WHERE event_id = ${eventId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { updatedAny = true; }
    }
    if !updatedAny { return error("NoChange", message = "No fields updated or event not found"); }
    stream<OrgEvent, sql:Error?> s = dbClient->query(`SELECT event_id, organization_id, title, description, location,
            event_date, start_time, end_time, required_volunteers, status, created_at FROM events WHERE event_id = ${eventId}`);
    record {| OrgEvent value; |}|sql:Error? n = s.next();
    sql:Error? _close = s.close();
    if n is record {| OrgEvent value; |} { return n.value; }
    return error("NotFound", message = "Event not found");
}

function deleteOrgEvent(int eventId) returns string|error {
    sql:ExecutionResult res = check dbClient->execute(`DELETE FROM events WHERE event_id = ${eventId}`);
    if res.affectedRowCount is int && res.affectedRowCount > 0 { return "Deleted"; }
    return error("NotFound", message = "Event not found");
}

// Helper to safely embed primitive values into dynamic SQL (basic quoting)
// removed setsql – parameterized queries now used above

function getOrgDonations(int id) returns OrgDonation[]|error {
    OrgDonation[] donations = [];
    stream<OrgDonation, sql:Error?> resultStream = dbClient->query(`SELECT * FROM donations WHERE orgId = ${id}`);
    while true {
        record {| OrgDonation value; |}|sql:Error? n = resultStream.next();
        if n is record {| OrgDonation value; |} { donations.push(n.value); continue; }
        break;
    }
    sql:Error? closeErr = resultStream.close();
    if closeErr is error { return closeErr; }
    return donations;
}

// --- Donation Requests ---

function createDonationRequest(DonationRequest req) returns DonationRequest|error {
    if req.organization_id <= 0 { return error("ValidationError", message = "organization_id required"); }
    string t = req.title.trim();
    if t == "" { return error("ValidationError", message = "title required"); }
    string d = req.description.trim();
    if d == "" { return error("ValidationError", message = "description required"); }
    string status = (req.status is string && (<string>req.status).trim() != "") ? <string>req.status : "active";
    sql:ExecutionResult r = check dbClient->execute(`INSERT INTO donation_requests 
            (organization_id, title, description, target_amount, contact_info, status)
            VALUES (${req.organization_id}, ${t}, ${d}, ${req.target_amount ?: ()}, ${req.contact_info ?: ()}, ${status})`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 {
        int newId = <int>r.lastInsertId;
        stream<DonationRequest, sql:Error?> s = dbClient->query(`SELECT request_id, organization_id, title, description, target_amount, contact_info, status, created_at FROM donation_requests WHERE request_id = ${newId}`);
        record {| DonationRequest value; |}|sql:Error? n = s.next();
    _ = check s.close();
        if n is record {| DonationRequest value; |} { return n.value; }
        return { request_id: newId, organization_id: req.organization_id, title: t, description: d, target_amount: req.target_amount ?: (), contact_info: req.contact_info ?: (), status: status, created_at: () };
    }
    return error("DBError", message = "Insert failed");
}

function listDonationRequests(int orgId) returns DonationRequest[]|error {
    DonationRequest[] items = [];
    stream<DonationRequest, sql:Error?> rs = dbClient->query(`SELECT request_id, organization_id, title, description, target_amount, contact_info, status, created_at FROM donation_requests WHERE organization_id = ${orgId}`);
    while true {
        record {| DonationRequest value; |}|sql:Error? n = rs.next();
        if n is record {| DonationRequest value; |} { items.push(n.value); continue; }
        break;
    }
    sql:Error? cerr = rs.close();
    if cerr is error { return cerr; }
    return items;
}

function getDonationRequest(int requestId) returns DonationRequest|error {
    if requestId <= 0 { return error("ValidationError", message = "requestId required"); }
    stream<DonationRequest, sql:Error?> s = dbClient->query(`SELECT request_id, organization_id, title, description, target_amount, contact_info, status, created_at FROM donation_requests WHERE request_id = ${requestId}`);
    record {| DonationRequest value; |}|sql:Error? n = s.next();
    sql:Error? cerr = s.close();
    if cerr is error { return cerr; }
    if n is record {| DonationRequest value; |} { return n.value; }
    return error("NotFound", message = "Donation request not found");
}

function updateDonationRequest(int requestId, DonationRequestUpdate upd) returns DonationRequest|error {
    if requestId <= 0 { return error("ValidationError", message = "requestId required"); }
    boolean changed = false;
    if upd.title is string {
        string t = (<string>upd.title).trim();
        if t == "" { return error("ValidationError", message = "title cannot be empty"); }
        sql:ExecutionResult r = check dbClient->execute(`UPDATE donation_requests SET title = ${t} WHERE request_id = ${requestId}`);
        if r.affectedRowCount is int && r.affectedRowCount > 0 { changed = true; }
    }
    if upd.description is string {
        string d = (<string>upd.description).trim();
        if d == "" { return error("ValidationError", message = "description cannot be empty"); }
        sql:ExecutionResult r = check dbClient->execute(`UPDATE donation_requests SET description = ${d} WHERE request_id = ${requestId}`);
        if r.affectedRowCount is int && r.affectedRowCount > 0 { changed = true; }
    }
    if upd.target_amount is decimal {
        decimal ta = <decimal>upd.target_amount;
        if ta < 0.0d { return error("ValidationError", message = "target_amount must be >= 0"); }
        sql:ExecutionResult r = check dbClient->execute(`UPDATE donation_requests SET target_amount = ${<decimal>upd.target_amount} WHERE request_id = ${requestId}`);
        if r.affectedRowCount is int && r.affectedRowCount > 0 { changed = true; }
    }
    if upd.contact_info is string {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE donation_requests SET contact_info = ${<string>upd.contact_info} WHERE request_id = ${requestId}`);
        if r.affectedRowCount is int && r.affectedRowCount > 0 { changed = true; }
    }
    if upd.status is string {
        sql:ExecutionResult r = check dbClient->execute(`UPDATE donation_requests SET status = ${<string>upd.status} WHERE request_id = ${requestId}`);
        if r.affectedRowCount is int && r.affectedRowCount > 0 { changed = true; }
    }
    if !changed { return error("NoChange", message = "No fields updated or donation request not found"); }
    return getDonationRequest(requestId);
}

function deleteDonationRequest(int requestId) returns string|error {
    if requestId <= 0 { return error("ValidationError", message = "requestId required"); }
    sql:ExecutionResult r = check dbClient->execute(`DELETE FROM donation_requests WHERE request_id = ${requestId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { return "Deleted"; }
    return error("NotFound", message = "Donation request not found");
}

// --- Feedback ---

function createFeedback(Feedback fb) returns Feedback|error {
    if fb.event_id <= 0 { return error("ValidationError", message = "event_id required"); }
    if fb.volunteer_id <= 0 { return error("ValidationError", message = "volunteer_id required"); }
    if fb.organization_id <= 0 { return error("ValidationError", message = "organization_id required"); }
    if fb.rating < 1 || fb.rating > 5 { return error("ValidationError", message = "rating must be 1-5"); }
    // Pre-check existence to avoid FK errors
    // Event exists?
    stream<record {| int eid; |}, sql:Error?> evS = dbClient->query(`SELECT event_id as eid FROM events WHERE event_id = ${fb.event_id}`);
    record {| record {| int eid; |} value; |}|sql:Error? evN = evS.next();
    sql:Error? evClose = evS.close();
    if evClose is error { return evClose; }
    if !(evN is record {| record {| int eid; |} value; |}) { return error("NotFound", message = "Event not found"); }
    // Volunteer exists?
    stream<record {| int uid; |}, sql:Error?> volS = dbClient->query(`SELECT user_id as uid FROM users WHERE user_id = ${fb.volunteer_id}`);
    record {| record {| int uid; |} value; |}|sql:Error? volN = volS.next();
    sql:Error? volClose = volS.close();
    if volClose is error { return volClose; }
    if !(volN is record {| record {| int uid; |} value; |}) { return error("NotFound", message = "Volunteer not found"); }
    // Organization exists?
    stream<record {| int oid; |}, sql:Error?> orgS = dbClient->query(`SELECT user_id as oid FROM users WHERE user_id = ${fb.organization_id}`);
    record {| record {| int oid; |} value; |}|sql:Error? orgN = orgS.next();
    sql:Error? orgClose = orgS.close();
    if orgClose is error { return orgClose; }
    if !(orgN is record {| record {| int oid; |} value; |}) { return error("NotFound", message = "Organization not found"); }
    // Duplicate feedback for event + volunteer?
    stream<record {| int fid; |}, sql:Error?> dupS = dbClient->query(`SELECT feedback_id as fid FROM feedback WHERE event_id = ${fb.event_id} AND volunteer_id = ${fb.volunteer_id}`);
    record {| record {| int fid; |} value; |}|sql:Error? dupN = dupS.next();
    sql:Error? dupClose = dupS.close();
    if dupClose is error { return dupClose; }
    if dupN is record {| record {| int fid; |} value; |} { return error("AlreadyExists", message = "Feedback already submitted for this event by volunteer"); }
    sql:ExecutionResult r = check dbClient->execute(`INSERT INTO feedback (event_id, volunteer_id, organization_id, rating, comment, hours_worked)
            VALUES (${fb.event_id}, ${fb.volunteer_id}, ${fb.organization_id}, ${fb.rating}, ${fb.comment ?: ()}, ${fb.hours_worked ?: ()})`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 {
        int newId = <int>r.lastInsertId;
        // Award performance badges automatically if rating qualifies (>=4)
        if fb.rating >= 4 { // no admin context here, set awarded_by null
            // Use helper with awardedByAdminId = -1 to mark system-awarded (DB will accept null if column allows)
            error? ap = ensurePerformanceBadges(fb.volunteer_id, -1);
            if ap is error { // ignore awarding errors, but log
                // silent ignore or add logging if log module imported elsewhere
            }
        }
        stream<Feedback, sql:Error?> s = dbClient->query(`SELECT feedback_id, event_id, volunteer_id, organization_id, rating, comment, hours_worked, given_at FROM feedback WHERE feedback_id = ${newId}`);
        record {| Feedback value; |}|sql:Error? n = s.next();
        _ = check s.close();
        if n is record {| Feedback value; |} { return n.value; }
        return { feedback_id: newId, event_id: fb.event_id, volunteer_id: fb.volunteer_id, organization_id: fb.organization_id, rating: fb.rating, comment: fb.comment ?: (), hours_worked: fb.hours_worked ?: (), given_at: () };
    }
    return error("DBError", message = "Insert failed");
}

function listFeedbackByEvent(int eventId) returns Feedback[]|error {
    Feedback[] list = [];
    stream<Feedback, sql:Error?> rs = dbClient->query(`SELECT feedback_id, event_id, volunteer_id, organization_id, rating, comment, hours_worked, given_at FROM feedback WHERE event_id = ${eventId}`);
    while true {
        record {| Feedback value; |}|sql:Error? n = rs.next();
        if n is record {| Feedback value; |} { list.push(n.value); continue; }
        break;
    }
    sql:Error? cerr = rs.close();
    if cerr is error { return cerr; }
    return list;
}

function listFeedbackByOrg(int orgId) returns Feedback[]|error {
    Feedback[] list = [];
    stream<Feedback, sql:Error?> rs = dbClient->query(`SELECT feedback_id, event_id, volunteer_id, organization_id, rating, comment, hours_worked, given_at FROM feedback WHERE organization_id = ${orgId}`);
    while true {
        record {| Feedback value; |}|sql:Error? n = rs.next();
        if n is record {| Feedback value; |} { list.push(n.value); continue; }
        break;
    }
    sql:Error? cerr = rs.close();
    if cerr is error { return cerr; }
    return list;
}



function getFeedback(int id) returns Feedback|error {
    if id <= 0 { return error("ValidationError", message = "id required"); }
    stream<Feedback, sql:Error?> s = dbClient->query(`SELECT feedback_id, event_id, volunteer_id, organization_id, rating, comment, hours_worked, given_at FROM feedback WHERE feedback_id = ${id}`);
    record {| Feedback value; |}|sql:Error? n = s.next();
    sql:Error? cerr = s.close();
    if cerr is error { return cerr; }
    if n is record {| Feedback value; |} { return n.value; }
    return error("NotFound", message = "Feedback not found");
}

function updateFeedback(int id, FeedbackUpdate upd) returns Feedback|error {
    boolean changed = false;
    if upd.rating is int {
        int r = <int>upd.rating;
        if r < 1 || r > 5 { return error("ValidationError", message = "rating must be 1-5"); }
        sql:ExecutionResult er = check dbClient->execute(`UPDATE feedback SET rating = ${r} WHERE feedback_id = ${id}`);
        if er.affectedRowCount is int && er.affectedRowCount > 0 { changed = true; }
    }
    if upd.comment is string {
        sql:ExecutionResult er = check dbClient->execute(`UPDATE feedback SET comment = ${<string>upd.comment} WHERE feedback_id = ${id}`);
        if er.affectedRowCount is int && er.affectedRowCount > 0 { changed = true; }
    }
    if upd.hours_worked is int {
    if <int>upd.hours_worked < 0 { return error("ValidationError", message = "hours_worked must be >= 0"); }
        sql:ExecutionResult er = check dbClient->execute(`UPDATE feedback SET hours_worked = ${<int>upd.hours_worked} WHERE feedback_id = ${id}`);
        if er.affectedRowCount is int && er.affectedRowCount > 0 { changed = true; }
    }
    if !changed { return error("NoChange", message = "No fields updated or feedback not found"); }
    stream<Feedback, sql:Error?> s = dbClient->query(`SELECT feedback_id, event_id, volunteer_id, organization_id, rating, comment, hours_worked, given_at FROM feedback WHERE feedback_id = ${id}`);
    record {| Feedback value; |}|sql:Error? n = s.next();
    sql:Error? cerr = s.close();
    if cerr is error { return cerr; }
    if n is record {| Feedback value; |} { return n.value; }
    return error("NotFound", message = "Feedback not found");
}

function deleteFeedback(int id) returns string|error {
    sql:ExecutionResult res = check dbClient->execute(`DELETE FROM feedback WHERE feedback_id = ${id}`);
    if res.affectedRowCount is int && res.affectedRowCount > 0 { return "Deleted"; }
    return error("NotFound", message = "Feedback not found");
}

// ---------------------- Automatic Performance Badges ----------------------
// Badge tiers at every 5 high-rated (4 or 5) feedback entries.
// Example names: "Bronze Volunteer" (5), "Silver Volunteer" (10), ... up to 50.
const int PERF_BADGE_INTERVAL = 5;
final string[] PERF_BADGE_NAMES = ["Bronze Volunteer", "Silver Volunteer", "Gold Volunteer", "Platinum Volunteer", "Diamond Volunteer", "Legend Volunteer", "Elite Volunteer", "Master Volunteer", "Grandmaster Volunteer", "Champion Volunteer"];

// Compute how many high-rated feedback rows a volunteer has and ensure badges for each 5-point tier.
function ensurePerformanceBadges(int volunteerId, int awardedByAdminId) returns error? {
    // Count existing qualifying feedback (rating 4 or 5)
    int highCount = 0;
    stream<record {| int cnt; |}, sql:Error?> cs = dbClient->query(`SELECT COUNT(*) AS cnt FROM feedback WHERE volunteer_id = ${volunteerId} AND rating >= 4`);
    record {| record {| int cnt; |} value; |}|sql:Error? cn = cs.next();
    sql:Error? cClose = cs.close(); if cClose is error { return cClose; }
    if cn is record {| record {| int cnt; |} value; |} { highCount = cn.value.cnt; }
    if highCount <= 0 { return; }
    int tiers = highCount / PERF_BADGE_INTERVAL; // integer division
    if tiers <= 0 { return; }
    // Fetch existing performance badge names for this volunteer
    map<boolean> have = {};
    stream<record {| string name; |}, sql:Error?> bs = dbClient->query(`SELECT badge_name AS name FROM badges WHERE volunteer_id = ${volunteerId}`);
    while true {
        record {| record {| string name; |} value; |}|sql:Error? bn = bs.next();
        if bn is record {| record {| string name; |} value; |} { have[bn.value.name] = true; continue; }
        break;
    }
    sql:Error? bClose = bs.close(); if bClose is error { return bClose; }
    int awarded = 0;
    int i = 1;
    while i <= tiers && i <= PERF_BADGE_NAMES.length() {
        string bName = PERF_BADGE_NAMES[i - 1];
        if have[bName] is () {
            // Insert badge
            int threshold = i * PERF_BADGE_INTERVAL;
            string desc = "Awarded for " + threshold.toString() + " high-rated feedback entries";
            // If awardedByAdminId < 0 treat as system auto-awarded (NULL awarded_by)
            if awardedByAdminId >= 0 {
                _ = check dbClient->execute(`INSERT INTO badges (volunteer_id, badge_name, badge_description, awarded_by) VALUES (${volunteerId}, ${bName}, ${desc}, ${awardedByAdminId})`);
            } else {
                _ = check dbClient->execute(`INSERT INTO badges (volunteer_id, badge_name, badge_description, awarded_by) VALUES (${volunteerId}, ${bName}, ${desc}, ${()})`);
            }
            awarded += 1;
        }
        i += 1;
    }
    // Optionally log awarded count; ignore if zero.
    return ();
}

// ---------------------- Core Badge Helpers (restored) ----------------------
function getBadge(int id) returns Badge|error {
    if id <= 0 { return error("ValidationError", message = "id required"); }
    stream<Badge, sql:Error?> s = dbClient->query(`SELECT badge_id, volunteer_id, badge_name, badge_description, earned_date, awarded_by FROM badges WHERE badge_id = ${id}`);
    record {| Badge value; |}|sql:Error? n = s.next();
    sql:Error? cerr = s.close(); if cerr is error { return cerr; }
    if n is record {| Badge value; |} { return n.value; }
    return error("NotFound", message = "Badge not found");
}

function listBadgesForVolunteer(int volunteerId) returns Badge[]|error {
    Badge[] list = [];
    stream<Badge, sql:Error?> rs = dbClient->query(`SELECT badge_id, volunteer_id, badge_name, badge_description, earned_date, awarded_by FROM badges WHERE volunteer_id = ${volunteerId}`);
    while true {
        record {| Badge value; |}|sql:Error? n = rs.next();
        if n is record {| Badge value; |} { list.push(n.value); continue; }
        break;
    }
    sql:Error? cerr = rs.close(); if cerr is error { return cerr; }
    return list;
}

function createBadge(BadgeCreate b) returns Badge|error {
    if b.volunteer_id <= 0 { return error("ValidationError", message = "volunteer_id required"); }
    string name = b.badge_name.trim(); if name == "" { return error("ValidationError", message = "badge_name required"); }
    // Ensure volunteer exists
    stream<record {| int uid; |}, sql:Error?> volS = dbClient->query(`SELECT user_id as uid FROM users WHERE user_id = ${b.volunteer_id}`);
    record {| record {| int uid; |} value; |}|sql:Error? volN = volS.next(); sql:Error? volClose = volS.close(); if volClose is error { return volClose; }
    if !(volN is record {| record {| int uid; |} value; |}) { return error("NotFound", message = "Volunteer not found"); }
    sql:ExecutionResult r = check dbClient->execute(`INSERT INTO badges (volunteer_id, badge_name, badge_description, awarded_by) VALUES (${b.volunteer_id}, ${name}, ${b.badge_description ?: ()}, ${b.awarded_by ?: ()})`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { int newId = <int>r.lastInsertId; return getBadge(newId); }
    return error("DBError", message = "Insert failed");
}

function updateBadge(int id, BadgeUpdate upd) returns Badge|error {
    boolean changed = false;
    if upd.badge_name is string { string n = (<string>upd.badge_name).trim(); if n == "" { return error("ValidationError", message = "badge_name cannot be empty"); } sql:ExecutionResult r = check dbClient->execute(`UPDATE badges SET badge_name = ${n} WHERE badge_id = ${id}`); if r.affectedRowCount is int && r.affectedRowCount > 0 { changed = true; } }
    if upd.badge_description is string { sql:ExecutionResult r = check dbClient->execute(`UPDATE badges SET badge_description = ${<string>upd.badge_description} WHERE badge_id = ${id}`); if r.affectedRowCount is int && r.affectedRowCount > 0 { changed = true; } }
    if upd.awarded_by is int { sql:ExecutionResult r = check dbClient->execute(`UPDATE badges SET awarded_by = ${<int>upd.awarded_by} WHERE badge_id = ${id}`); if r.affectedRowCount is int && r.affectedRowCount > 0 { changed = true; } }
    if !changed { return error("NoChange", message = "No fields updated or badge not found"); }
    return getBadge(id);
}

function deleteBadge(int id) returns string|error {
    sql:ExecutionResult r = check dbClient->execute(`DELETE FROM badges WHERE badge_id = ${id}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { return "Deleted"; }
    return error("NotFound", message = "Badge not found");
}

// ====================== Event Applications ==========================
// Expected DB table:
// CREATE TABLE event_applications (
//   application_id INT AUTO_INCREMENT PRIMARY KEY,
//   volunteer_id INT NOT NULL,
//   event_id INT NOT NULL,
//   status VARCHAR(20) DEFAULT 'pending',
//   applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   UNIQUE KEY uniq_vol_event (volunteer_id, event_id)
// );
type EventApplication record {| 
    int application_id?;
    int volunteer_id;
    int event_id;
    string? application_status?;      // pending | accepted | rejected
    string? applied_at?;
|};

// Fetch single application for volunteer+event
function getEventApplicationByVolunteerAndEvent(int volunteerId, int eventId) returns EventApplication|error {
    stream<EventApplication, sql:Error?> s = dbClient->query(`SELECT application_id, volunteer_id, event_id, application_status, applied_at FROM event_applications WHERE volunteer_id = ${volunteerId} AND event_id = ${eventId}`);
    record {| EventApplication value; |}|sql:Error? n = s.next();
    sql:Error? c = s.close(); if c is error { return c; }
    if n is record {| EventApplication value; |} { return n.value; }
    return error("NotFound", message = "Application not found");
}

// Create application if not already there (idempotent)
function createEventApplication(int volunteerId, int eventId) returns EventApplication|error {
    // Return existing if present
    EventApplication|error existing = getEventApplicationByVolunteerAndEvent(volunteerId, eventId);
    if existing is EventApplication { return existing; }
    // Ensure event exists
    stream<record {| int eid; |}, sql:Error?> es = dbClient->query(`SELECT event_id AS eid FROM events WHERE event_id = ${eventId}`);
    record {| record {| int eid; |} value; |}|sql:Error? en = es.next();
    sql:Error? eClose = es.close(); if eClose is error { return eClose; }
    if !(en is record {| record {| int eid; |} value; |}) { return error("NotFound", message = "Event not found"); }
    // Ensure volunteer exists
    stream<record {| int vid; |}, sql:Error?> vs = dbClient->query(`SELECT user_id AS vid FROM users WHERE user_id = ${volunteerId} AND user_type = 'volunteer'`);
    record {| record {| int vid; |} value; |}|sql:Error? vn = vs.next();
    sql:Error? vClose = vs.close(); if vClose is error { return vClose; }
    if !(vn is record {| record {| int vid; |} value; |}) { return error("NotFound", message = "Volunteer not found"); }
    // Insert
    sql:ExecutionResult ins = check dbClient->execute(`INSERT INTO event_applications (volunteer_id, event_id) VALUES (${volunteerId}, ${eventId})`);
    if ins.affectedRowCount is int && ins.affectedRowCount > 0 {
        return getEventApplicationByVolunteerAndEvent(volunteerId, eventId);
    }
    // Possible race: another insert happened; try fetch again
    EventApplication|error second = getEventApplicationByVolunteerAndEvent(volunteerId, eventId);
    if second is EventApplication { return second; }
    return error("DBError", message = "Apply failed");
}

function listEventApplicationsForEvent(int eventId) returns EventApplication[]|error {
    EventApplication[] list = [];
    stream<EventApplication, sql:Error?> s = dbClient->query(`SELECT application_id, volunteer_id, event_id, application_status, applied_at FROM event_applications WHERE event_id = ${eventId}`);
    while true { record {| EventApplication value; |}|sql:Error? n = s.next(); if n is record {| EventApplication value; |} { list.push(n.value); continue; } break; }
    sql:Error? c = s.close(); if c is error { return c; }
    return list;
}

function listEventApplicationsForVolunteer(int volunteerId) returns EventApplication[]|error {
    EventApplication[] list = [];
    stream<EventApplication, sql:Error?> s = dbClient->query(`SELECT application_id, volunteer_id, event_id, application_status, applied_at FROM event_applications WHERE volunteer_id = ${volunteerId}`);
    while true { record {| EventApplication value; |}|sql:Error? n = s.next(); if n is record {| EventApplication value; |} { list.push(n.value); continue; } break; }
    sql:Error? c = s.close(); if c is error { return c; }
    return list;
}

function updateEventApplicationStatus(int applicationId, string newStatus) returns EventApplication|error {
    string sNorm = newStatus.toLowerAscii();
    if sNorm != "accepted" && sNorm != "rejected" && sNorm != "pending" { return error("ValidationError", message = "Invalid status"); }
    sql:ExecutionResult r = check dbClient->execute(`UPDATE event_applications SET application_status = ${sNorm} WHERE application_id = ${applicationId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 {
        stream<EventApplication, sql:Error?> s = dbClient->query(`SELECT application_id, volunteer_id, event_id, application_status, applied_at FROM event_applications WHERE application_id = ${applicationId}`);
        record {| EventApplication value; |}|sql:Error? n = s.next();
        sql:Error? c = s.close(); if c is error { return c; }
        if n is record {| EventApplication value; |} { return n.value; }
    }
    return error("NotFound", message = "Application not found");
}

function deleteEventApplicationByVolunteer(int volunteerId, int eventId) returns string|error {
    sql:ExecutionResult r = check dbClient->execute(`DELETE FROM event_applications WHERE volunteer_id = ${volunteerId} AND event_id = ${eventId}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { return "Withdrawn"; }
    return error("NotFound", message = "Application not found");
}

