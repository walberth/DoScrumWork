namespace AgileWork.ModelView
{
    using System.Collections.Generic;

    using Models;

    public class SprintViewModel
    {
        public string Uid { get; set; }

        public string Name { get; set; }

        public string IdProject { get; set; }

        public IEnumerable<UserStories> Stories { get; set; }

        public IEnumerable<UserTask> Tasks { get; set; }
    }
}