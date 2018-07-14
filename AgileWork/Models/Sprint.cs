using System;

namespace AgileWork.Models 
{
    public class Sprint 
    {
        public string Uid { get; set; }
        public string Name { get; set; }
        public string IdProject { get; set; }

        public Sprint() {}

        public Sprint(string uid, string name, string idProject) 
        {
            Uid = uid ?? throw new ArgumentNullException(nameof(uid));
            Name = name ?? throw new ArgumentNullException(nameof(name));
            IdProject = idProject ?? throw new ArgumentNullException(nameof(idProject));
        }

        public override string ToString() 
        {
            return $"{nameof(Uid)}: {Uid}, {nameof(Name)}: {Name}, {nameof(IdProject)}: {IdProject}";
        }
    }
}