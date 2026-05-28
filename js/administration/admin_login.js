function doAdminLogin(){

  var email =
    document.getElementById('a-email').value.trim();

  var pass =
    document.getElementById('a-pass').value.trim();

  if(
      email === 'admin@stockeasy.com'
      &&
      pass === 'admin123'
  ){

      localStorage.setItem(
        'stockeasy_admin',
        'true'
      );

      window.location.href =
        'app_admin.html';

  }else{

      var err =
        document.getElementById('ea-err');

      if(err){

         err.classList.add('show');

      }

  }

}