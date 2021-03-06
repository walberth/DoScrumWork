﻿using System.Web.Optimization;

namespace AgileWork {
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Js").Include(
                "~/Content/plugins/jQuery/jquery-2.2.3.min.js",
                "~/Content/plugins/jQueryUI/jquery-ui.min.js",
                "~/Content/bootstrap/js/bootstrap.min.js",
                "~/Content/plugins/handlebars/handlebars-v4.0.11.js",
                "~/Content/plugins/moment/min/moment-with-locales.min.js",
                "~/Content/plugins/bootstrap-daterangepicker/daterangepicker.js",
                "~/Content/plugins/select2/dist/js/select2.full.min.js",
                "~/Content/plugins/select2/dist/js/i18n/es.js",
                "~/Content/plugins/iCheck/icheck.min.js",
                "~/Content/plugins/datatables-1.10.16/js/jquery.dataTables.min.js",
                "~/Content/plugins/datatables-1.10.16/js/dataTables.bootstrap.min.js",
                "~/Content/plugins/datatables-1.10.16/plugins/dataRender/ellipsis.js",
                "~/Content/plugins/highcharts/highcharts.js",
                "~/Content/plugins/highcharts/modules/no-data-to-display.js",
                "~/Content/plugins/highcharts/modules/exporting.js",
                "~/Content/plugins/highcharts/modules/export-data.js",
                "~/Content/plugins/highcharts/modules/export-csv.js",
                "~/Content/plugins/sheetjs/dist/xlsx.full.min.js",
                "~/Content/plugins/jquery-circle-progress/1.2.2/circle-progress.min.js",
                "~/Content/dist/js/pageLoad.js",
                "~/Content/dist/js/statistics.js",
                "~/Content/dist/js/highcharts_theme.js",
                "~/Content/dist/js/object.js",
                "~/Content/dist/js/app.min.js",
                "~/Content/dist/js/create_project.js",
                "~/Content/dist/js/view_projects.js",
                "~/Content/dist/js/project_detail.js",
                "~/Content/dist/js/attach_sprint_us.js",
                "~/Content/dist/js/sprint_board.js",
                "~/Content/dist/js/datesBuilder.js"));

            bundles.Add(new StyleBundle("~/Css").Include(
                "~/Content/bootstrap/css/bootstrap.min.css",
                "~/Content/dist/css/AdminLTE.min.css",
                "~/Content/dist/css/skins/skin-green-light.min.css",
                "~/Content/plugins/bootstrap-daterangepicker/daterangepicker.css",
                "~/Content/plugins/select2/dist/css/select2.min.css",
                "~/Content/plugins/select2/bootstrap_theme/css/select2-bootstrap.min.css",
                "~/Content/plugins/datatables-1.10.16/css/dataTables.bootstrap.min.css",
                "~/Content/plugins/iCheck/square/blue.css",
                "~/Content/dist/css/create_project.css",
                "~/Content/dist/css/pageLoad.css",
                "~/Content/dist/css/login.css",
                "~/Content/dist/css/view_projects.css",
                "~/Content/dist/css/attach_sprint_us.css",
                "~/Content/dist/css/sprint_board.css",
                "~/Content/dist/css/project_detail.css",
                "~/Content/dist/css/mq_base.css",
                "~/Content/dist/css/statistics.css",
                "~/Content/dist/css/base.css"));

            BundleTable.EnableOptimizations = true;
        }
    }
}