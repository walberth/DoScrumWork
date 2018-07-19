using System.Collections.Generic;

namespace AgileWork.ModelView 
{
    public class AttachSprintViewModel 
    {
        public List<SprintViewModel> ListSprintViewModel { get; set; }

        public List<UserStoriesViewModel> ListUserStoriesViewModel { get; set; }
    }
}