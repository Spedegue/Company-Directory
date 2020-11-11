class Entry {
  constructor(firstName, lastName, email, jobTitle, department, location, id) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.jobTitle = jobTitle;
    this.department = department;
    this.location = location;
    this.id = id;
  }

  displayCard() {
    const card = `<div class="col mb-4 entry-card" id=card${id}>
      <div class="card shadow-lg bg-light h-100">
        <div class="card-body">
          <h4 class="capital">${firstName} ${lastName}</h5>
          <h6 class="capital">${title} </h6>
          <div class="card-div">
          <p class="capital"><i>${email}</i></p>
          <p class="upper">${department}</p>
          <p class="upper">${location} </p>
          </div>
          ${editButton}
          ${deleteButton}
        </div>
      </div>
    </div>`;
  }

  editEntry() {
    $('#editModalTitle').html(`${this.firstName} ${this.lastName}`);
    $('#editFirstName').val(this.firstName);
    $('#editLastName').val(this.lastName);
    $('#editEmail').val(this.email);
    $('#departmentEditSelect').val(this.departmentID);
    $('#editTitle').val(this.jobTitle);
    $('#editModal').modal();
  }

  editEntry() {}
}

class Location {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  launchEditModal() {}

  editLocation() {}
}
