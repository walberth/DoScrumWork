namespace AgileWork.ModelView 
{
    public class UserStoriesViewModel 
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
    }
}