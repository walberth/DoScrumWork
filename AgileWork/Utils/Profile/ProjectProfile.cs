namespace AgileWork.Utils.Profile
{
    using AutoMapper;

    using Models;

    using ModelView;

    public class ProjectProfile : Profile
    {
        public ProjectProfile()
        {
           this.CreateMap<ProjectViewModel, Project>()
            ?.ForMember(project => project.Uid, projectView => projectView?.MapFrom(projectForView => projectForView.Uid))
            ?.ForMember(project => project.Name, projectView => projectView?.MapFrom(projectForView => projectForView.Name))
            ?.ForMember(project => project.IdUserCreated, projectView => projectView?.MapFrom(projectForView => projectForView.IdUserCreated))
            ?.ForMember(project => project.Description, projectView => projectView?.MapFrom(projectForView => projectForView.Description))
            ?.ForMember(project => project.StartDate, projectView => projectView?.MapFrom(projectForView => projectForView.StartDate))
            ?.ForMember(project => project.EndDate, projectView => projectView?.MapFrom(projectForView => projectForView.EndDate))
            ?.ForMember(project => project.UserStories, projectView => projectView?.MapFrom(projectForView => projectForView.UserStoriesViewModel))
            ?.ReverseMap();
        }
    }
}