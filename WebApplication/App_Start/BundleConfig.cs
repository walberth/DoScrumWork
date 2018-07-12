namespace WebApplication
{
    using System.Web.Optimization;

    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Js").Include(
                "~/Content/plugins/jQuery/jquery-2.2.3.min.js",
                "~/Content/bootstrap/js/bootstrap.min.js",
                "~/Content/dist/js/jquery.validate.min.js",
                "~/Content/dist/js/additional-methods.min.js",
                "~/Content/dist/js/script-custom-validator.js",
                "~/Content/dist/js/toastr.min.js",
                "~/Content/dist/js/typeahead.bundle.min.js",
                "~/Content/plugins/slimScroll/jquery.slimscroll.min.js",
                "~/Content/plugins/datatables/jquery.dataTables.min.js",
                "~/Content/plugins/datatables/dataTables.bootstrap.min.js",
                "~/Content/plugins/slimScroll/jquery.slimscroll.min.js",
                "~/Content/plugins/fastclick/fastclick.js",
                "~/Content/plugins/iCheck/icheck.min.js",
                "~/Content/dist/js/app.min.js",
                "~/Content/dist/js/demo.js"));

            bundles.Add(new StyleBundle("~/Css").Include(
                "~/Content/bootstrap/css/bootstrap.min.css",
                "~/Content/dist/css/font-awesome.min.css",
                "~/Content/dist/css/ionicons.min.css",
                "~/Content/dist/css/skins/_all-skins.min.css",
                "~/Content/dist/css/AdminLTE.min.css",
                "~/Content/dist/css/toastr.min.css",
                "~/Content/dist/css/typeahead.css",
                "~/Content/plugins/iCheck/square/blue.css"));

            BundleTable.EnableOptimizations = true;
        }
    }
}