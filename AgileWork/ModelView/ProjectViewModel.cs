namespace AgileWork.ModelView
{
    using System.Collections.Generic;
    
    public class ProjectViewModel
    {
        public string Uid { get; set; }

        public string Name { get; set; }

        public string IdUserCreated { get; set; }

        public string Description { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public List<UserStoriesViewModel> UserStoriesViewModel { get; set; }

        public List<SprintViewModel> SprintViewModel { get; set; }
    }
}