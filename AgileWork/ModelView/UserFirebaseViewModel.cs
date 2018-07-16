namespace AgileWork.ModelView
{
    using System.ComponentModel.DataAnnotations;

    public class UserFirebaseViewModel
    {
        public string Uid { get; set; }

        [Required]
        [Display(Name = "Email")]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }   
    }
}