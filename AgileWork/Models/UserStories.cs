namespace AgileWork.Models 
{
    using System;

    public class UserStories 
    {
        public string Uid { get; set; }

        public string Name { get; set; }

        public string IdProject { get; set; }

        public string Description { get; set; }

        public string IdUserResponsable { get; set; }

        public string UserResponsable { get; set; }

        public int? Effort { get; set; }

        public int? Priority { get; set; }

        public string AcceptanceCriteria { get; set; }

        public string IdSprint { get; set; }

        public string State { get; set; }

        public UserStories()
        {
        }

        public UserStories(string uid, string name, string idProject, string description, string idUserResponsable, string userResponsable, int? effort, int? priority, string acceptanceCriteria, string idSprint, string state) 
        {
            Uid = uid;
            Name = name;
            IdProject = idProject;
            Description = description;
            IdUserResponsable = idUserResponsable;
            UserResponsable = userResponsable;
            Effort = effort;
            Priority = priority;
            AcceptanceCriteria = acceptanceCriteria;
            IdSprint = idSprint;
            State = state;
        }

        public override string ToString() 
        {
            return $"{nameof(Uid)}: {Uid}, {nameof(Name)}: {Name}, {nameof(IdProject)}: {IdProject}, {nameof(Description)}: {Description}, {nameof(IdUserResponsable)}: {IdUserResponsable}, {nameof(UserResponsable)}: {UserResponsable}, {nameof(Effort)}: {Effort}, {nameof(Priority)}: {Priority}, {nameof(AcceptanceCriteria)}: {AcceptanceCriteria}, {nameof(IdSprint)}: {IdSprint}, {nameof(State)}: {State}";
        }
    }
}