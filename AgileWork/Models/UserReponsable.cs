using System;

namespace AgileWork.Models 
{
    public class UserReponsable 
    {
        public string Uid { get; set; }
        public string Name { get; set; }

        public UserReponsable() {}

        public UserReponsable(string uid, string name) 
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