function Validate() {
    var password = document.getElementById("Password").value;
    var confirmPassword = document.getElementById("CPassword").value;
    if (password != confirmPassword) {
        alert("Passwords dont match! Please re-enter.")
    }
}