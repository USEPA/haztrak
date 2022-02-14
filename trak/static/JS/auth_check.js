function validate(form)
{
    fail = validatefname(form.fname.value)
    fail += validatelname(form.lname.value)
    fail += validateuname(form.uname.value)
    fail += validateemail(form.email.value)
    fail += validatepssword(form.psswd1.value, form.psswd2.value)

    if (fail =="") return true
    else { alert(fail); return false}
}
   function validatefname(field)
   {
       return (field =="") ? "no first name was entered.\n" : ""
   }

   function validatelname(field)
   {
       return (field =="") ? "no last name was entered.\n" : ""
   }

   function validateuname(field)
   {
        if (field == "") return "No user name was entered.\n"
        else if (field.length < 4)
            return "Username must be longer than 4 characters.\n"
        else if (/[^a-zA-Z0-9]/.test(field))
            return "Only a-z and 0-9 characters, upper of lower allowed in username.\n"
        return ""
   }

   function validateemail(field)
   {
       if (field == "") return "No email entered.\n"
       else
        return ""
   }

   function validatepssword(psswd1, psswd2)
   {
       if (psswd1 =="" || psswd2 =="") return "One of the required passwords was not enetered"
        else if (!(psswd1 === psswd2))
            return "Passwords do not match"
        else if (psswd1 < 8)
            return "Password must be at least 6 characters long, inlcude 1 uppercase, 1 lowercase, adn 1 number.\n"
        else if (!/[a-z]/.test(psswd1) || !/[A-Z]/.test(psswd1) || !/[0-9]/.test(psswd1))
            return "Passwords require one of each: a-z, A-Z, 0-9"
        else
            return ""
   }