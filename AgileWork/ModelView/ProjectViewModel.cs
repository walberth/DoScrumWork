namespace AgileWork.ModelView
{
    using System.Collections.Generic;

    using Models;

    public class ProjectViewModel
    {
        public string Uid { get; set; }

        public string Name { get; set; }

        public List<UserStories> UserStories { get; set; }
    }
}