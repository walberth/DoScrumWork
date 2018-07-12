$(document).ready(function () {
    //Add validation method
    $.validator.addMethod("strongPassword",
        function(value, element) {
            return this.optional(element)
                || value.length >= 6
                && /\d/.test(value)
                && /[a-z]/i.test(value);
        },
        "La contraseña debe tener al menos 6 caracteres de largo y contener al menos un numero y un caracter");

    $.validator.setDefaults({
        errorClass: "help-block",
        highlight: function(element) {
            $(element)
                .closest(".form-group")
                .addClass("has-error");
        },
        unhighlight: function (element) {
            $(element)
                .closest(".form-group")
                .removeClass("has-error");
        }
        //errorPlacement: function(error, element) {
        //    if (element.prop("type") === "checkbox") {
        //        error.insertAfter(element.parent());
        //    } else {
        //        error.insertAfter(element);
        //    }
        //}
    });

    $("#loginForm").validate({
        rules: {
            email: {
                required: true,
                email: true
                //remote: "http://localhost:3000/"
            },
            passwordhash: {
                required: true,
                strongPassword: true
            }
            //rememberMe: {
            //    required: true
            //}
        },
        messages: {
            email: {
                required: "Ingresa un correo electrónico",
                email: "Ingresa un correo <em>valido<em>"
                //remote: $.validator.format("La cuenta con {0} ya existe")
            }
            //rememberMe: {
            //    required: "Seleccionar recordar cuenta"
            //}
        }
    });

    debugger;

    $("#dataTablePaymentsForBank").hide();

    $("#submitPaymentForBank").on("click", function (event) {
        event.preventDefault();

        var data = new FormData();
        var uploadfile = $("#uploadfile").get(0).files;

        if (uploadfile.length > 0) {
            data.append("PaymentsFile", uploadfile[0]);
        }

        $("#submitPaymentForBank").prop("disabled", true);

        var payment = {
            UploadFile: '@Url.Action("UploadFile", "Payment")',
            LoadPaymentsInFile: '@Url.Action("LoadPaymentsInFile", "Payment")'
        }

        $.ajax({
            url: '/Payment/UploadFile',/*payment.UploadFile,*/
            method: "POST",
            enctype: 'multipart/form-data',
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (response) {
                $("#submitPaymentForBank").prop("disabled", false);

                $('#myModal').modal('show');

                $('#formFile')[0].reset();

                var table = $('#tableForPayments').DataTable();

                table.destroy();

                $("#tableForPayments").DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    bProcessing: true,
                    sAjaxSource: '/Payment/LoadPaymentsInFile',/*payment.LoadPaymentsInFile,*/
                    "rowCallback": function (row, data, index) {
                        if (data[5] === "Pago no ingresado al sistema") {
                            $(row).find('td:eq(5)')
                                .css('color', 'red')
                                .html('<b>' + data[5] + '</b>');
                        } else if (data[5] === "Pago ingresado al sistema") {
                            $(row).find('td:eq(5)').css('color', 'green');
                        }
                    }
                });

                $("#dataTablePaymentsForBank").show();
            },
            error: function (xhr, textStatus, err) {
                console.log("readyState: " + xhr.readyState);
                console.log("responseText: " + xhr.responseText);
                console.log("status: " + xhr.status);
                console.log("text status: " + textStatus);
                console.log("error: " + err);

                $("#submitPaymentForBank").prop("disabled", false);
            }
        });
    });
});   