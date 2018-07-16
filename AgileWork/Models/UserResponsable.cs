namespace AgileWork.Models 
{
    using System;

    public class UserResponsable 
    {
        public string Uid { get; set; }

        public string Name { get; set; }

        public UserResponsable()
        {
        }

        public UserResponsable(string uid, string name) 
        {
            Uid = uid ?? throw new ArgumentNullException(nameof(uid));
            Name = name ?? throw new ArgumentNullException(nameof(name));
        }

        public override string ToString() 
        {
            return $"{nameof(Uid)}: {Uid}, {nameof(Name)}: {Name}";
        }
    }
}