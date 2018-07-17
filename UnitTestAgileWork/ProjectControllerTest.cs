namespace UnitTestAgileWork
{
    using AgileWork.Controllers;

    using App_Data;

    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class ProjectControllerTest
    {
        [AssemblyInitialize]
        public static void AssemblyInitialize(TestContext ctx)
        {
            StartUp.Register();          
        }

        [TestMethod]
        public void ProjectController_DataMapping_CorrectInput()
        {
            // Arrange
            var projectController = new ProjectController();
            var project = NewProjectData.ProjectTestingData();

            // Act
            var result = projectController.SaveProject(project);

            // Assert

        }

        [TestMethod]
        public void ProjectController_ProjectDetail_CorrectConsumeAppi()
        {
            // Arrange
            var projectController = new ProjectController();
            var idProject = "-LHPKP9_cKSXMBS_ClEs";

            // Act 
            var result = projectController.ProjectDetail(idProject);
        }
    }
}
