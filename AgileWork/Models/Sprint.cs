using System;
using System.Collections.Generic;

namespace AgileWork.Models 
{
    public class Sprint 
    {
        public string Uid { get; set; }
        public string Name { get; set; }
        public string IdProject { get; set; }
        public List<UserStories> Stories { get; set; }
        public List<UserTask> Tasks { get; set; }
        
        public Sprint() {}

        public Sprint(string uid, string name, string idProject, List<UserStories> stories, List<UserTask> tasks) 
        {
            Uid = uid ?? throw new ArgumentNullException(nameof(uid));
            Name = name ?? throw new ArgumentNullException(nameof(name));
            IdProject = idProject ?? throw new ArgumentNullException(nameof(idProject));
            Stories = stories ?? throw new ArgumentNullException(nameof(stories));
            Tasks = tasks ?? throw new ArgumentNullException(nameof(tasks));
        }

        public override string ToString() 
        {
            return $"{nameof(Uid)}: {Uid}, {nameof(Name)}: {Name}, {nameof(IdProject)}: {IdProject}";
        }
    }
}