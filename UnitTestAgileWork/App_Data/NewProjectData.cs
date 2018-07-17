namespace UnitTestAgileWork.App_Data
{
    using System.Collections.Generic;

    using AgileWork.ModelView;

    public class NewProjectData
    {
        public static ProjectViewModel ProjectTestingData()
        {
            return new ProjectViewModel()
            {
                Uid = null,
                Name = "Nuevo Proyecto",
                IdUserCreated = "abcde",
                Description = "Nuevo proyecto por estamos probando",
                StartDate = "18/05/2015",
                EndDate = "20/05/2018", 
                UserStoriesViewModel = new List<UserStoriesViewModel>()
                {
                    new UserStoriesViewModel()
                    {
                        Name = "Como usuario quiero A",
                        Description = "Requeire A para poder llegar a B",
                        IdUserResponsable = "aosncaiocnasicn",
                        UserResponsable = "Pepito",
                        Effort = 1,
                        Priority = 4,
                        AcceptanceCriteria = "Debe estar bien hecho A"
                    },
                    new UserStoriesViewModel()
                    {
                        Name = "Como usuario quiero A",
                        Description = "Requeire A para poder llegar a B",
                        IdUserResponsable = "aosncaiocnasicn",
                        UserResponsable = "Pepito",
                        Effort = 1,
                        Priority = 4,
                        AcceptanceCriteria = "Debe estar bien hecho A"
                    }, 
                    new UserStoriesViewModel()
                    {
                        Name = "Como usuario quiero A",
                        Description = "Requeire A para poder llegar a B",
                        IdUserResponsable = "aosncaiocnasicn",
                        UserResponsable = "Pepito",
                        Effort = 1,
                        Priority = 4,
                        AcceptanceCriteria = "Debe estar bien hecho A"
                    }
                }
            };
        }
    }
}