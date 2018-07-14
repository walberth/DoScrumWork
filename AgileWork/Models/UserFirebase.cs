using System;

namespace AgileWork.Models 
{
    public class UserFirebase 
    {
        public string Uid { get; set; }
        public string Email { get; set; }

        public UserFirebase() {}

        public UserFirebase(string uid, string email) 
        {
            Uid = uid ?? throw new ArgumentNullException(nameof(uid));
            Email = email ?? throw new ArgumentNullException(nameof(email));
        }

        public override string ToString() 
        {
            return $"{nameof(Uid)}: {Uid}, {nameof(Email)}: {Email}";
        }
    }
}