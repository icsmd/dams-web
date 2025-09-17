import _ from 'lodash';
window._ = _;

// Import the sweetalert2 library and create a new Swal instance.
import Swal from 'sweetalert2';

// Assign the Swal instance to the global `window.Swal` variable.
window.Swal = Swal;


window.Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})