//TODO
//Reconfigure to only use filters - remove get all?
//Stylings - fonts, modals
//Search functionality
//Option to remove all personnel when removing department/location DELETE FROM personnel where departmentID =
//Style modals
//Remove jqXHR response text
//Mobile display

let table, activeID, activeName, activeTable;

// Get details for all personnel
const getAll = () => {
  const results = [];
  $.getJSON('php/getAll.php', (result) => {
    const data = result.data;
    $.each(data, (key, value) => {
      results.push(value);
    });
    displayResults(results);
  });
};

//Render results as HTML table
const displayResults = (results) => {
  const editIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg>`;
  const deleteIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>`;
  $('#cardDisplay').html('');
  $('#resultsTable').html('');

  results.forEach((result) => {
    const {
      firstName,
      lastName,
      email,
      location,
      department,
      departmentID,
      jobTitle,
      id,
    } = result;
    const editButton = `<button class="btn btn-outline-primary btn-sm badge edit-btn card-btn position-absolute" onclick="editEntryModal('${firstName}', '${lastName}','${email}', '${departmentID}', '${jobTitle}', ${id})">${editIcon}</button>`;
    const deleteButton = `<button class="btn btn-sm btn-outline-danger badge delete-btn card-btn position-absolute" onclick="deletePersonnel('${firstName} ${lastName}', ${id})">${deleteIcon}</button>`;
    //Remove this line for production
    const title = jobTitle ? jobTitle : 'Head Of ' + department;
    const card = `<div class="col mb-4 entry-card" id=card${id}>
      <div class="card shadow-lg bg-light h-100">
        <div class="card-body">
          <h4 class="capital">${firstName} ${lastName}</h5>
          <div class="card-div">
          <h6 class="capital">${title} </h6>
          <p class="capital"><i>${email}</i></p>
          <p class="upper">${department}</p>
          <p class="upper">${location} </p>
          </div>
          ${editButton}
          ${deleteButton}
        </div>
      </div>
    </div>`;

    const tableRow = `<tr>
    <td>${firstName}</td>
    <td>${lastName}</td>
    <td class="mobile-hide">${title}</td>
    <td class="mobile-hide">${email}</td>
    <td class="mobile-hide">${department}</td>
    <td class="mobile-hide">${location}</td>
    <td>
   <button class="btn btn-outline-primary btn-sm badge edit-btn card-btn" onclick="editEntryModal('${firstName}', '${lastName}','${email}', '${departmentID}', '${jobTitle}', ${id})">${editIcon}</button>
 <button class="btn btn-sm btn-outline-danger badge delete-btn card-btn " onclick="deletePersonnel('${firstName} ${lastName}', ${id})">${deleteIcon}</button>
    
    </td>
    </tr>`;

    $('#resultsTable').append(tableRow);
    $('#cardDisplay').append(card);
  });
};

//Populate any checkboxes or selects with exiting locations and departments
const populateFilters = (data, table) => {
  $(`#${table}Filters`).html('');
  $(`.${table}-select`).html('');
  data.forEach((entry) => {
    $(`#${table}Filters`).append(`
                    <label class="form-check-label" for="${entry.name}Check">
                    <input
                    class="form-check-input"
                    type="checkbox"
                    name="filter"
                    data-id=${entry.id}
                    data-table=${table}
                    value="${entry.id}"
                    checked
                  />
                  
                  ${entry.name}
                  </label>
                  <br>
    `);
    //Populate selects for department/location
    $(`.${table}-select`).append(`
    <option value=${entry.id}>${entry.name}</option>`);
  });
};

const getAllDepartments = () => {
  $.getJSON('php/getAllDepartments.php', (result) => {
    populateFilters(result.data, 'department');
  });
};

const getAllLocations = () => {
  $.getJSON('php/getAllLocations.php', (result) => {
    populateFilters(result.data, 'location');
  });
};

//Get SQL query for filters
const getFilterQuery = () => {
  const departmentFilters = [];
  const locationFilters = [];
  //Loop through any boxes that are checked
  $(`input:checkbox[name=filter]:checked`).each((i, el) => {
    const filter = $(el)[0];
    const database = $(filter).data('table');
    const id = $(filter).data('id');
    if (database == 'department') {
      departmentFilters.push(id);
    } else {
      locationFilters.push(id);
    }
  });
  const joinedLocations = locationFilters.join(' OR l.id = ');
  const joinedDepartments = departmentFilters.join(' OR d.id = ');
  const locationIdQuery = joinedLocations ? 'l.id =' : '';
  const conditional = joinedDepartments && joinedLocations ? 'OR' : '';
  const departmentIdQuery = joinedDepartments ? 'd.id =' : '';
  const query = `${locationIdQuery} ${joinedLocations} ${conditional} ${departmentIdQuery} ${joinedDepartments}`;
  return query;
};

//Run SQL query with applied filters
const applyFilters = () => {
  const query = getFilterQuery();
  $.getJSON('php/getByFilter.php', { query: query })
    .done((result) => {
      const results = [];
      const data = result.data;
      $.each(data, (key, val) => {
        results.push(val);
      });
      displayResults(results);
    })
    .fail((x) => {
      console.log(x.responseText);
    });
};

//Deselect all filters
const deselectAll = () => {
  $('input:checkbox[name=filter]').prop('checked', false);
};

//Select all filters
const selectAll = () => {
  $('input:checkbox[name=filter]').prop('checked', true);
};

//Feedback Modal to indicate success or failure of operation
const displayFeedback = (response, message) => {
  $('#confirmationModalTitle').html(response);
  $('#confirmationModalBody').html(message);
  $('#confirmationModal').modal();
};

//Reset active global variables to avoid unexpectedly affecting wrong entry
const resetActives = () => {
  activeTable = undefined;
  activeID = undefined;
  activeName = undefined;
};

const confirmDeletion = () => {
  if ($('#deleteInput').val() === activeName) {
    if (activeTable == 'personnel') {
      deleteEntry();
    } else if (activeTable == 'location') {
      deleteLocationEmployees();
    } else if (activeTable == 'department') {
      deleteDepartmentEmployees();
    } else {
      console.log('no table match');
      resetActives();
      return;
    }
  } else {
    $('#deleteFeedback').html('No Match');
  }
};

//Delete a single row from specified table by ID
const deleteEntry = () => {
  $('#deleteEntryModal').modal('hide');
  $.ajax({
    url: 'php/deleteEntry.php',
    dataType: 'json',
    type: 'POST',
    data: { id: activeID, name: activeName, table: activeTable },
  })
    .done((result) => {
      displayFeedback('Success', result.data);
      resetActives();
      applyFilters();
      getAllDepartments();
      getAllLocations();
    })
    .fail((jqXHR) => {
      console.log(jqXHR.responseText);
      displayFeedback('Fail', jqXHR.responseText);
    });
};

//Delete personnel member
const deletePersonnel = (name, id) => {
  activeID = id;
  activeName = name;
  activeTable = 'personnel';
  $('#deleteWarningMessage').html(`Warning!`);
  $('#deleteEntryTitle').html('Delete Staff Member');
  $('#deleteEntryModal').modal();
};

//Launch confirmation modal for location deletion
const deleteLocation = () => {
  activeID = $('#locationSelect').find(':selected').val();
  activeName = $('#locationSelect').find(':selected').html();
  activeTable = 'location';
  $('#deleteWarningMessage').html(
    `Warning! This will delete the location along with all departments and personnel within them. If you do not wish to do this please use edit instead.`
  );
  $('#deleteEntryTitle').html('Delete Location');
  $('#deleteEntryModal').modal();
};

//Delete the location along with all the employees :(
const deleteLocationEmployees = () => {
  $('#deleteEntryModal').modal('hide');
  $.ajax({
    url: 'php/deleteLocation.php',
    type: 'POST',
    dataType: 'json',
    data: {
      locationID: activeID,
      name: activeName,
    },
  })
    .done(() => {
      //Send through to delete entry function as this function will not work with locations with no personnel
      deleteEntry();
    })
    .fail((jqXHR) => {
      resetActives();
      displayFeedback('Error', jqXHR.responseText);
    });
};

//Launch confirmation modal for department deletion

const deleteDepartment = () => {
  activeID = $('#departmentSelect').find(':selected').val();
  activeName = $('#departmentSelect').find(':selected').html();
  activeTable = 'department';
  $('#deleteWarningMessage').html(
    `Warning! This will delete the department along with all all personnel within it. If you do not wish to do this, please either edit the personnel or department instead.`
  );
  $('#deleteEntryTitle').html('Delete Department');
  $('#deleteEntryModal').modal();
};

const deleteDepartmentEmployees = () => {
  $('#deleteEntryModal').modal('hide');
  $.ajax({
    url: 'php/deleteDepartment.php',
    type: 'POST',
    dataType: 'json',
    data: {
      departmentID: activeID,
      name: activeName,
    },
  })
    .done((result) => {
      deleteEntry();
    })
    .fail((jqXHR) => {
      resetActives();
      displayFeedback('Error', jqXHR.responseText);
    });
};

$('#addModal').on('show.bs.modal', () => {
  $('#addFirstName').val('');
  $('#addLastName').val('');
  $('#addEmail').val('');
  $('#addTitle').val('');
});

//Add new entry
const addNewEntry = () => {
  $('#addModal').modal('hide');
  $.ajax({
    url: 'php/addEntry.php',
    type: 'POST',
    dataType: 'json',
    data: {
      firstName: $('#addFirstName').val().trim(),
      lastName: $('#addLastName').val().trim(),
      email: $('#addEmail').val().trim(),
      jobTitle: $('#addTitle').val().trim(),
      departmentID: $('#departmentAddSelect').find(':selected').val(),
    },
  })
    .done((result) => {
      displayFeedback('Success', result.data);
      applyFilters();
    })
    .fail((jqXHR) => {
      displayFeedback('Error', jqXHR.responseText);
    });
};

//Add new location
const addNewLocation = () => {
  //Remove any superfluous whitespace
  const locationName = $('#newLocationName').val().trim();
  $('#addLocationModal').modal('hide');
  $.ajax({
    url: 'php/addLocation.php',
    type: 'POST',
    dataType: 'json',
    data: {
      locationName: locationName,
    },
  })
    .done((result) => {
      displayFeedback('Success', result.data);
      applyFilters();
      getAllLocations();
    })
    .fail((jqXHR) => {
      displayFeedback('Error', jqXHR.responseText);
    });
};

//Add department

const addNewDepartment = () => {
  const name = $('#newDepartmentName').val();
  const locationID = $('#locationAddSelect').find(':selected').val();
  $('#addDepartmentModal').modal('hide');
  $.ajax({
    url: 'php/addDepartment.php',
    type: 'POST',
    dataType: 'json',
    data: {
      locationID: locationID,
      departmentName: name,
    },
  })
    .done((result) => {
      displayFeedback('Success', result.data);
      applyFilters();
      getAllDepartments();
    })
    .fail((jqXHR) => {
      displayFeedback('Error', jqXHR.responseText);
    });
};

//Display modal to allow edits
const editEntryModal = (
  firstName,
  lastName,
  email,
  departmentID,
  jobTitle,
  id
) => {
  console.log(departmentID);
  activeID = id;
  $('#editModalTitle').html(`${firstName} ${lastName}`);
  //Populate modal with existing values
  $('#editFirstName').val(firstName);
  $('#editLastName').val(lastName);
  $('#editEmail').val(email);
  $('#departmentEditSelect').val(departmentID);
  $('#editTitle').val(jobTitle);
  $('#editModal').modal();
};

//Confirm entry edit

const confirmEntryEdit = () => {
  const departmentId = $('#departmentEditSelect').find(':selected').val();
  $.ajax({
    url: 'php/updateStaff.php',
    type: 'POST',
    dataType: 'json',
    data: {
      firstName: $('#editFirstName').val(),
      lastName: $('#editLastName').val(),
      jobTitle: $('#editTitle').val(),
      email: $('#editEmail').val(),
      departmentId: departmentId,
      id: activeID,
    },
  })
    .done((result) => {
      $('#editModal').modal('hide');
      displayFeedback('Success', result.data);
      applyFilters();
      resetActives();
    })
    .fail((jqXHR) => {
      $('#editModal').modal('hide');
      resetActives();
      displayFeedback('Fail', jqXHR.responseText);
    });
};

//Confirm editing of location name

const confirmLocationEdit = () => {
  const locationName = $('#editLocationName').val();
  const locationID = $('#locationSelect').find(':selected').val();

  $('#editLocationModal').modal('hide');
  $.ajax({
    url: 'php/editLocation.php',
    type: 'POST',
    dataType: 'json',
    data: {
      locationName: locationName,
      locationID: locationID,
    },
  })
    .done((result) => {
      displayFeedback('Success', result.data);
      getAllLocations();
      applyFilters();
      resetActives();
    })
    .fail((jqXHR) => {
      resetActives();
      displayFeedback('Fail', jqXHR.responseText);
    });
};

//Cofimr department edits
const confirmEditDepartment = () => {
  const departmentName = $('#editDepartmentName').val();
  const departmentID = $('#departmentSelect').find(':selected').val();
  const locationID = $('#locationEditSelect').val();
  console.log(locationID);
  $('#editDepartmentModal').modal('hide');
  $.ajax({
    url: 'php/editDepartment.php',
    type: 'POST',
    dataType: 'json',
    data: {
      departmentName: departmentName,
      departmentID: departmentID,
      locationID: locationID,
    },
  })
    .done((result) => {
      displayFeedback('Success', result.data);
      getAllDepartments();
      applyFilters();
      resetActives();
    })
    .fail((jqXHR) => {
      resetActives();
      displayFeedback('Fail', jqXHR.responseText);
    });
};

const getBySearch = () => {
  const term = $('#tableSearch').val();
  const query = getFilterQuery();
  $.getJSON('php/getBySearch.php', { term: term, query: query })
    .done((result) => {
      console.log(result);
      const results = [];
      const data = result.data;
      $.each(data, (key, val) => {
        results.push(val);
      });
      console.log(results);
      displayResults(results);
    })
    .fail((x) => {
      console.log(x.responseText);
    });
};

$(function () {
  getAll();
  getAllDepartments();
  getAllLocations();

  $('#filterBtn').click(applyFilters);
  $('#deselectAllBtn').click(deselectAll);
  $('#selectAllBtn').click(selectAll);

  $('#searchBtn').click(getBySearch);

  $('#deleteBtn').click(confirmDeletion);
  $('#addNewEntryBtn').click(() => $('#addModal').modal());
  $('#confirmAddBtn').click(addNewEntry);
  $('#addNewDepartmentBtn').click(() => $('#addDepartmentModal').modal());
  $('#addNewLocationBtn').click(() => $('#addLocationModal').modal());
  $('#confirmAddLocationBtn').click(addNewLocation);
  $('#confirmAddDepartmentBtn').click(addNewDepartment);
  $('#departmentDeleteBtn').click(deleteDepartment);
  $('#locationDeleteBtn').click(deleteLocation);
  $('#locationEditBtn').click(() => $('#editLocationModal').modal());
  $('#confirmEditLocationBtn').click(confirmLocationEdit);
  $('#departmentEditBtn').click(() => $('#editDepartmentModal').modal());
  $('#confirmEditDepartmentBtn').click(confirmEditDepartment);

  $('#confirmEditBtn').click(confirmEntryEdit);
  //Reset forms each time they are opened
  $('#deleteEntryModal').on('show.bs.modal', () => {
    $('#deleteTarget').html(activeName);
    $('#deleteInput').val('');
    $('#deleteFeedback').html('');
  });

  $('#addLocationModal').on('show.bs.modal', () => {
    $('#newLocationName').val('');
  });

  $('#addDepartmentModal').on('show.bs.modal', () => {
    $('#newDepartmentName').val('');
  });

  $('#editLocationModal').on('show.bs.modal', () => {
    $('#editLocationName').val($('#locationSelect').find(':selected').html());
  });

  $('#editDepartmentModal').on('show.bs.modal', () => {
    $('#editDepartmentName').val(
      $('#departmentSelect').find(':selected').html()
    );
    const departmentID = $('#departmentSelect').val();
    $.getJSON(
      `php/getLocationID.php?departmentID=${departmentID}`,
      (result) => {
        const locationID = result.data[0].locationID;
        $('#locationEditSelect').val(locationID);
      }
    );
  });

  $('#tableToggle').click(() => {
    $('#tableWrapper').toggle();
    $('#cardDisplay').slideToggle(300);
  });

  // $(document).on('click', '.entry-card', function () {
  //   console.log('click');
  //   const $this = $(this);
  //   console.log($this);
  //   console.log($this.data('info'));
  // });
});
