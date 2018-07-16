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
            Uid = uid ?? throw new ArgumentNullException(nameof(uid));
            Name = name ?? throw new ArgumentNullException(nameof(name));
            IdProject = idProject ?? throw new ArgumentNullException(nameof(idProject));
            Description = description ?? throw new ArgumentNullException(nameof(description));
            IdUserResponsable = idUserResponsable ?? throw new ArgumentNullException(nameof(idUserResponsable));
            UserResponsable = userResponsable ?? throw new ArgumentNullException(nameof(userResponsable));
            Effort = effort;
            Priority = priority;
            AcceptanceCriteria = acceptanceCriteria ?? throw new ArgumentNullException(nameof(acceptanceCriteria));
            IdSprint = idSprint ?? throw new ArgumentNullException(nameof(idSprint));
            State = state ?? throw new ArgumentNullException(nameof(state));
        }

        public override string ToString() 
        {
            return $"{nameof(Uid)}: {Uid}, {nameof(Name)}: {Name}, {nameof(IdProject)}: {IdProject}, {nameof(Description)}: {Description}, {nameof(IdUserResponsable)}: {IdUserResponsable}, {nameof(UserResponsable)}: {UserResponsable}, {nameof(Effort)}: {Effort}, {nameof(Priority)}: {Priority}, {nameof(AcceptanceCriteria)}: {AcceptanceCriteria}, {nameof(IdSprint)}: {IdSprint}, {nameof(State)}: {State}";
        }
    }
}