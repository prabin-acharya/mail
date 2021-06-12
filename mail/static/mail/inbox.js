document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Add event listener to the form
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

//Form data Processing
function send_email(event){
  // Modifies the default beheavor so it doesn't reload the page after submitting.
  event.preventDefault();

  //const from = document.querySelector('input').value;
  const to = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {  
    method: 'POST',
    body: JSON.stringify({
      recipients : to,
      subject : subject,
      body : body
    }),
  })
  .then((response) => response.json())
  .then((result) => {
    load_mailbox('sent', result);
  })
  .catch((error) => console.log(error));
}


function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  

  //Get data of the corresponding mailbox from the server
  fetch(`emails/${mailbox}`)
  .then((response)=>response.json())
  .then((emails)=>{
    emails.forEach(function(email){
    const parent_div = document.createElement('div') 
    build_email(email, parent_div)
  })
  })
  .catch((error)=>console.log(error))


function build_email(email, parent_div){
  parent_div.innerHTML = `<b> ${email.sender}</b> : ${email.subject}<hr> `
  document.querySelector('#emails-view').appendChild(parent_div);
}

}