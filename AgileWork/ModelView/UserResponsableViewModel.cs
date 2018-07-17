namespace AgileWork.ModelView 
{
    using System.Collections.Generic;

    using Models;

    public class UserResponsableViewModel 
    {
        public byte? Uid { get; set; }

        public IEnumerable<UserResponsable> UserResponsables { get; set; }
    }
}