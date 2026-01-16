export class Mentor {
    constructor({
        id = '',
        mentor_id = '',
        name = '',
        about = '',
        profile_image = '',
        is_verified = false,
        experties_in = [],
        category = '',
        education = [],
        skills = [],
        experience = [],
        testimonial = [],
        is_platformAssured = false,
        address = '',
        rating = 0,
        coursesOffered = [],
    } = {}) {
        this.id = id;
        this.mentor_id = mentor_id;
        this.name = name;
        this.about = about;
        this.profile_image = profile_image;
        this.is_verified = is_verified;
        this.experties_in = experties_in;
        this.category = category;
        this.education = education;
        this.skills = skills;
        this.experience = experience;
        this.testimonial = testimonial;
        this.is_platformAssured = is_platformAssured;
        this.address = address;
        this.rating = rating;
        this.coursesOffered = coursesOffered;
    }

    toString() {
        return `
      Mentor {
        id: ${this.id},
        mentor_id: ${this.mentor_id},
        category: ${this.category},
        verified: ${this.is_verified},
        platformAssured: ${this.is_platformAssured},
        coursesOffered: ${JSON.stringify(this.coursesOffered)}
      }
    `;
    }
}