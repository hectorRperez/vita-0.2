let currentSizes = [];
let currentImages = [];
let editId = null;
let editImageId = null;

// Obtener todos los elementos de formulario del documento
let forms = document.querySelectorAll("form");

// Recorrer cada elemento de formulario
for (let form of forms) {
  // Agregar un evento de submit al formulario
  form.addEventListener("submit", function (event) {
    // Prevenir el comportamiento por defecto de enviar el formulario
    event.preventDefault();

    // Validate sizes required
    if (currentSizes.length === 0) {
      Swal.fire(
        'Required field!',
        'The required size field.',
        'error'
      )

      return false;
    }

    // Validate images required
    if (currentImages.length === 0) {
        Swal.fire(
          'Required field!',
          'The required image field.',
          'error'
        )
  
        return false;
      }

    // Obtener la URL del action del formulario
    let action = form.getAttribute("action");

    // Obtener los datos del formulario como un objeto FormData
    let formData = new FormData(form);

    const method = editId ? "PUT" : "POST";

    currentSizes.forEach(currentSize => {
      formData.append('sizes[]', currentSize);
    });

    currentImages.forEach(currentImage => {
      if (!currentImage?.id) {
        formData.append('images', currentImage);
      }
    });

    if (editId) {
      formData.append("id", editId);
    }

    fetch(action, {
      method,
      body: formData,
      redirect: "follow",
    })
      .then(async (response) => {
        if (response.ok) {
          currentSizes = [];
          currentImages = [];
          const jsonData = await response.json();
          await Swal.fire("Success!", jsonData.message, "success");
          if (jsonData?.redirect) window.location.href = jsonData.redirect;
          else window.location.reload();
        } else {
          // Si hay algún error, mostrar un mensaje
          Swal.fire({
            text: response.statusText,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        // Si hay algún error de red, mostrar un mensaje
        alert("Error de red: " + error);
      })
  });
}

$( document ).ready(function() {
  $('#categoryId').on('change', function() {
    const template = $(this).children('option:selected').data('template');

    toggleShowInputs(template);
  });
})

function toggleShowInputs(template) {
  switch (template) {
    case 'TEMPLATE_ONE':
      $('.showDerma').addClass('d-none');
      $('.showSerum').removeClass('d-none');
      $('#text_howUse').text('How to use:');
      $('#text_caution').text('Caution:');
    break;
    default:
      $('.showSerum').addClass('d-none');
      $('.showDerma').removeClass('d-none');
      $('#text_howUse').text('Instructions:');
      $('#text_caution').text('Precaution & Possible Side Effects:');
  }
}

function confirmDelete(id) {
  const name = $(`#${id}-name`).text();
  Swal.fire({
    title: 'Are you sure?',
    text: `Will remove the product: ${name}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `products/${id}`,
        type: 'DELETE',
        success: function(result) {
          Swal.fire(
            'Deleted!',
            'Your product has been deleted.',
            'success'
          )

          setTimeout(function () {
            window.location.reload();
          }, 300);
        },
        error: function (request, status, error) {
          Swal.fire(
            'Failed to delete!',
            request.responseJSON.message,
            'error'
          )
        }
      });
    }
  });
}

function showEdit(id) {
  editId = id;

  $.ajax({
    url: `products/${id}`,
    type: 'GET',
    success: function(result) {
      const product = result.data;

      toggleShowInputs(product.category.template);

      $('#categoryId').val(product.category.id).change();
      $('#label').val(product.label).change();
      $('#name').val(product.name);
      $('#description').val(product.description);
      $('#price').val(product.price);
      $('#quantity').val(product.quantity);
      $('#assessment').val(product.assessment);
      $('#weight').val(product.weight);
      $('#dimensions').val(product.dimensions);
      $('#keyBenefits').val(product.keyBenefits);
      $('#howUse').val(product.howUse);
      $('#ingredients').val(product.ingredients);
      $('#caution').val(product.caution);

      // Sizes
      $('#sizes-items tbody').html('');

      currentSizes = [];

      let index = 0;
      product.sizes.forEach(size => {
        if (size !== '') {
          currentSizes.push(size);
          $('#sizes-items tbody').html(
            $('#sizes-items tbody').html() +
            `<tr id="size-${index}">
              <td>${size}</td>
              <td>
                <button class="btn btn-danger" onclick="deleteSize(${index})">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>`
          );
          index++;
        }
      });

      $('#box_sizes').removeClass('d-none');

      // Images
      $('#images-items tbody').html('');

      currentImages = [];

      index = 0;
      product.images.forEach((image) => {
        currentImages.push(image);
        const viewImageId = `view-image-${index}`;
        $("#images-items tbody").html(
          $("#images-items tbody").html() +
            `<tr id="image-${index}">
              <td>
                <img src="${image.image}" id="${viewImageId}" style="width: 10em;" />
              </td>
              <td>
                <div class="btn btn-success" onclick="editImage(${index})">
                  <i class="fas fa-edit"></i>
                </div>
                <div class="btn btn-danger${image.isFirst ? ' d-none' : ''}" onclick="deleteImage(${index})">
                  <i class="fas fa-trash"></i>
                </div>
              </td>
            </tr>`
        );
        index++;
      });

      $('#box_images').removeClass('d-none');

      $('#button_submit').text('Update');
      $('#button_cancel').removeClass('d-none');

      $('#images').prop('required', false);
    }
  });
}

function cancel() {
  editId = null;
  $('#button_submit').text('Submit');
  $('#button_cancel').addClass('d-none');
  $('#images').prop('required', true);

  $('#categoryId').val('').change();
  $('#label').val('').change();
  $('#name').val('');
  $('#description').val('');
  $('#price').val('');
  $('#quantity').val('');
  $('#assessment').val('');
  $('#weight').val('');
  $('#dimensions').val('');
  $('#keyBenefits').val('');
  $('#howUse').val('');
  $('#ingredients').val('');
  $('#caution').val('');

  $('#sizes-items tbody').html('');
  currentSizes = [];
  $('#images-items tbody').html('');
  currentImages = [];

  $('.showDerma').addClass('d-none');
  $('.showSerum').addClass('d-none');
}

// Size
function addSize() {
  const sizes = $('#sizes').val();

  if ($.trim(sizes) !== '') {
    currentSizes.push(sizes);
    const index = currentSizes.length - 1;

    $('#sizes-items tbody').html(
      $('#sizes-items tbody').html() +
      `<tr id="size-${index}">
        <td>${sizes}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteSize(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>`
    );

    $('#sizes').val('');
    $('#box_sizes').removeClass('d-none');
  }
}

function deleteSize(id) {
  currentSizes.splice(id, 1);
  $(`#size-${id}`).remove();

  if (currentSizes.length === 0) {
    $('#box_sizes').addClass('d-none');
  }
}

// Image
function addImage() {
  const images = $('#images');

  if (images && images[0].files.length > 0) {
    currentImages.push(images[0].files[0]);
    const index = currentImages.length - 1;
    const viewImageId = `view-image-${index}`;

    $('#images-items tbody').html(
      $('#images-items tbody').html() +
      `<tr id="image-${index}">
        <td>
          <img id="${viewImageId}" style="width: 10em;" />
        </td>
        <td>
          <button class="btn btn-success" onclick="editImage(${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger" onclick="deleteImage(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>`
    );

    readURL(images[0], viewImageId);

    $('#images').val('');
    $('#box_images').removeClass('d-none');
  }
}

function editImage(id) {
  $('#edit-image').trigger('click');
  $('#edit-image').on('change', function() {
    if (editId && currentImages[id]?.id) {
      updateImageInServe(editId, currentImages[id].id, this);
    } else {
      updateImage(this, false);
    }
  });

  editImageId = id;
}

function updateImage(input, notUpdateCurrentImages) {
  if (editImageId >= 0) {
    const viewImageId = `view-image-${editImageId}`;

    if (!notUpdateCurrentImages) {
      currentImages[editImageId] = input.files[0];
    }

    readURL(input, viewImageId);

    $('#edit-image').val('');
  }

  editImageId = null;
}

function deleteImage(id) {
  if (editId && currentImages[id]?.id) {
    confirmDeleteImage(editId, currentImages[id].id, id);

    return;
  }

  currentImages.splice(id, 1);
  $(`#image-${id}`).remove();

  if (currentImages.length === 0) {
    $("#box_images").addClass("d-none");
  }
}

function confirmDeleteImage(id, idImage, currentImageId) {
  Swal.fire({
    title: 'Are you sure?',
    text: `Will remove the image`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `products/${id}/images/${idImage}`,
        type: 'DELETE',
        success: function() {
          Swal.fire(
            'Deleted!',
            'Your image has been deleted.',
            'success'
          )

          currentImages.splice(currentImageId, 1);
          $(`#image-${currentImageId}`).remove();
        },
        error: function (request) {
          Swal.fire(
            'Failed to delete!',
            request.responseJSON.message,
            'error'
          )
        }
      });
    }
  });
}

function updateImageInServe(id, idImage, input) {
  let formData = new FormData();

  formData.append("id", editId);
  formData.append('image', input.files[0]);

  $.ajax({
    url: `products/${id}/images/${idImage}`,
    type: 'PUT',
    data: formData,
    processData: false,
    contentType: false,
    dataType: 'json',
    success: function() {
      Swal.fire(
        'Updated!',
        'Your image has been updated.',
        'success'
      )

      updateImage(input, true);
    },
    error: function (request) {
      Swal.fire(
        'Failed to delete!',
        request.responseJSON.message,
        'error'
      )
    }
  });
}

function readURL(input, imageId) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();

    reader.onload = function(e) {
      // Asignamos el atributo src a la tag de imagen
      $(`#${imageId}`).attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
  }
}