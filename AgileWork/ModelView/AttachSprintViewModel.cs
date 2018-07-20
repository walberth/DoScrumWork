using System.Collections.Generic;

namespace AgileWork.ModelView 
{
    public class AttachSprintViewModel 
    {
        public string IdProject { get; set; }

        public List<SprintViewModel> ListSprintViewModel { get; set; }

        public List<UserStoriesViewModel> ListUserStoriesViewModel { get; set; }
    }

    public class SetUserStorieToSprintViewModel 
    {
        public string IdUserStory { get; set; }

        public string IdSprint { get; set; }
    }
}