import ballerina/sql;

// Volunteer related record types
type VolunteerProfile record {
	int volunteer_id;
	string name;
	string? bio;
	string? skills;
};

type VolunteerProfileUpdate record {
	string? bio;
	string? skills;
};

type VolunteerRanking record {
	int volunteer_id;
	string name;
	int total_hours;
	decimal? avg_rating;
};

// Fetch a single volunteer profile (joins users + optional volunteer_profiles row)
function fetchVolunteerProfile(int id) returns VolunteerProfile|error {
	// Ensure volunteer exists and get name
	stream<record {| int uid; string name; |}, sql:Error?> us = dbClient->query(`SELECT user_id AS uid, name FROM users WHERE user_id = ${id} AND user_type = 'volunteer'`);
	record {| record {| int uid; string name; |} value; |}|sql:Error? un = us.next();
	sql:Error? uClose = us.close(); if uClose is error { return uClose; }
	if !(un is record {| record {| int uid; string name; |} value; |}) { return error("NotFound", message = "Volunteer not found"); }
	record {| int uid; string name; |} u = un.value;
	// Fetch profile details if exist
	stream<record {| string? bio; string? skills; |}, sql:Error?> ps = dbClient->query(`SELECT bio, skills FROM volunteer_profiles WHERE volunteer_id = ${id}`);
	record {| record {| string? bio; string? skills; |} value; |}|sql:Error? pn = ps.next();
	sql:Error? pClose = ps.close(); if pClose is error { return pClose; }
	string? bio = (); string? skills = ();
	if pn is record {| record {| string? bio; string? skills; |} value; |} { bio = pn.value.bio; skills = pn.value.skills; }
	return { volunteer_id: u.uid, name: u.name, bio: bio ?: (), skills: skills ?: () };
}

// Update or insert volunteer profile row.
function upsertVolunteerProfile(int id, VolunteerProfileUpdate upd) returns VolunteerProfile|error {
	// Ensure volunteer exists
	stream<record {| int uid; |}, sql:Error?> vs = dbClient->query(`SELECT user_id AS uid FROM users WHERE user_id = ${id} AND user_type = 'volunteer'`);
	record {| record {| int uid; |} value; |}|sql:Error? vn = vs.next();
	sql:Error? vClose = vs.close(); if vClose is error { return vClose; }
	if !(vn is record {| record {| int uid; |} value; |}) { return error("NotFound", message = "Volunteer not found"); }
	// Check existing profile row
	stream<record {| int vid; |}, sql:Error?> es = dbClient->query(`SELECT volunteer_id AS vid FROM volunteer_profiles WHERE volunteer_id = ${id}`);
	record {| record {| int vid; |} value; |}|sql:Error? en = es.next();
	sql:Error? eClose = es.close(); if eClose is error { return eClose; }
	if en is record {| record {| int vid; |} value; |} {
		// update
		if upd.bio is string { _ = check dbClient->execute(`UPDATE volunteer_profiles SET bio = ${<string>upd.bio} WHERE volunteer_id = ${id}`); }
		if upd.skills is string { _ = check dbClient->execute(`UPDATE volunteer_profiles SET skills = ${<string>upd.skills} WHERE volunteer_id = ${id}`); }
	} else {
		// insert new
		_ = check dbClient->execute(`INSERT INTO volunteer_profiles (volunteer_id, bio, skills) VALUES (${id}, ${upd.bio ?: ()}, ${upd.skills ?: ()})`);
	}
	return fetchVolunteerProfile(id);
}

// List top volunteers aggregated from feedback. Sorting param can be hours (default) or rating.
function computeTopVolunteers(string sortBy, int maxCount) returns VolunteerRanking[]|error {
	VolunteerRanking[] list = [];
	stream<record {| int vid; string name; int? total_hours; decimal? avg_rating; |}, sql:Error?> rs = dbClient->query(`SELECT u.user_id AS vid, u.name AS name, SUM(f.hours_worked) AS total_hours, AVG(f.rating) AS avg_rating
		FROM users u LEFT JOIN feedback f ON u.user_id = f.volunteer_id
		WHERE u.user_type = 'volunteer'
		GROUP BY u.user_id, u.name`);
	while true {
		record {| record {| int vid; string name; int? total_hours; decimal? avg_rating; |} value; |}|sql:Error? n = rs.next();
		if n is record {| record {| int vid; string name; int? total_hours; decimal? avg_rating; |} value; |} {
			record {| int vid; string name; int? total_hours; decimal? avg_rating; |} v = n.value;
			list.push({ volunteer_id: v.vid, name: v.name, total_hours: v.total_hours ?: 0, avg_rating: v.avg_rating ?: () });
			continue;
		}
		break;
	}
	sql:Error? cerr = rs.close(); if cerr is error { return cerr; }
	// Manual simple sort for small list
	int count = list.length();
	if sortBy == "rating" {
		int i = 0;
		while i < count {
			int j = i + 1;
			while j < count {
				decimal ai = list[i].avg_rating ?: 0.0d;
				decimal aj = list[j].avg_rating ?: 0.0d;
				if aj > ai { VolunteerRanking tmp = list[i]; list[i] = list[j]; list[j] = tmp; }
				j += 1;
			}
			i += 1;
		}
	} else { // hours
		int i = 0;
		while i < count {
			int j = i + 1;
			while j < count {
				int ai = list[i].total_hours; int aj = list[j].total_hours;
				if aj > ai { VolunteerRanking tmp = list[i]; list[i] = list[j]; list[j] = tmp; }
				j += 1;
			}
			i += 1;
		}
	}
	if list.length() > maxCount { return list.slice(0, maxCount); }
	return list;
}
