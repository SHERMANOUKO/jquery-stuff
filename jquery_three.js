// Page Name:
document.getElementById("pageName").textContent = "Update Fee Balance";

$('#updateFeeCard').css({
    "box-shadow": "0px 6px 10px 1px rgba(0, 0, 0, 0.5)"
});

function ExportToTable() {
    $('.alert').alert('close')
    document.getElementById("infoHeader").style.display = "none";
    document.getElementsByClassName("spinner-border")[0].style.display = "block";  
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;  
    /*Checks whether the file is a valid excel file*/  
    $('#exceltable').empty();
    if (regex.test($("#excelfile").val().toLowerCase())) {  
        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
        if ($("#excelfile").val().toLowerCase().indexOf(".xlsx") > 0) {  
            xlsxflag = true;  
        }  
        /*Checks whether the browser supports HTML5*/  
        if (typeof (FileReader) != "undefined") {  
            var reader = new FileReader();  
            reader.onload = function (e) {  
                var data = e.target.result;  
                /*Converts the excel data in to object*/  
                if (xlsxflag) {  
                    var workbook = XLSX.read(data, { type: 'binary' });  
                }  
                else {  
                    var workbook = XLS.read(data, { type: 'binary' });  
                }  
                /*Gets all the sheetnames of excel in to a variable*/  
                var sheet_name_list = workbook.SheetNames;  

                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/  
                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/  
                    /*Convert the cell value to Json*/  
                    if (xlsxflag) {  
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]).slice(0,5);
                    }  
                    else {  
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]).slice(0,5);  
                    }  
                    if (exceljson.length > 0 && cnt == 0) {
                        BindTable(exceljson, '#exceltable');  
                         
                    }else{
                        $( "#message" ).html( "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">"+
                            "<p class=\"text text-center\">Could Not Create Preview. The Uploaded Excel Document Seems Not To Be Having Any Column Headers or Titles. Please Try Again Or Use A Properly Formatted Excel Document.</p>"+
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                            "<span aria-hidden=\"true\">&times;</span></button>"+
                        "</div>" );
                        cnt++; 
                    }  
                });  
                document.getElementById("infoHeader").style.display = "block";
                document.getElementsByClassName("spinner-border")[0].style.display = "none";
                $('#exceltable').show();  
            }  
            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
                reader.readAsArrayBuffer($("#excelfile")[0].files[0]);  
            }  
            else {  
                reader.readAsBinaryString($("#excelfile")[0].files[0]);  
            }
        }  
        else {
        document.getElementsByClassName("spinner-border")[0].style.display = "none";  
            $('#unsupported').modal('show')  
        }  
    }  
    else {
    document.getElementsByClassName("spinner-border")[0].style.display = "none";
        $('#exampleModalCenter').modal('show')
    }  
}  


function BindTable(jsondata, tableid) {/*Function used to convert the JSON array to Html Table*/  
    var columns = BindTableHeader(jsondata, tableid); /*Gets all the column headings of Excel*/
    
    for (var i = 0; i < jsondata.length; i++) {  
            var row$ = $('<tr/>');  
            for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
                var cellValue = jsondata[i][columns[colIndex]];  
                if (cellValue == null)  
                    cellValue = "";  
                row$.append($('<td/>').html(cellValue));  
            }  
            $(tableid).append(row$);  
    }
    if(!columns.includes("adm") || !columns.includes("balance")){
    $('#invalidExcel').modal('show')  
    }else{
    sendFile($("#excelfile")[0].files[0])
    }  
}  
function BindTableHeader(jsondata, tableid) {/*Function used to get all column names from JSON and bind the html table header*/  
    var columnSet = [];  
    var headerTr$ = $('<tr/>');  
    for (var i = 0; i < jsondata.length; i++) {  
        var rowHash = jsondata[i];  
        for (var key in rowHash) {  
            if (rowHash.hasOwnProperty(key)) {  
                if ($.inArray(key, columnSet) == -1) {/*Adding each unique column names to a variable array*/  
                    columnSet.push(key);  
                    headerTr$.append($('<th/>').html(key));  
                }  
            }  
        }  
    }  
    $(tableid).append(headerTr$);
    return columnSet;  
}  

function sendFile(excelFile){
    document.getElementsByClassName("spinner-border")[0].style.display = "block";
    var data = new FormData();
    var file = excelFile
    data.append('file', file);

    $.ajax({
        type: "POST",
        url: schoolUrl+"/updateBalanceRecords",
        processData : false,
        contentType : false,
        data: data
        }).done(function(data){
            if(data.code == 200){
                    $( "#message" ).html( "<div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">"+
                    "<p class=\"text text-center\">SUCCESS!: "+data.message+"</p>"+
                    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                    "<span aria-hidden=\"true\">&times;</span></button>"+
                    "</div>" );
                    document.getElementsByClassName("spinner-border")[0].style.display = "none";
            }else{
                    $( "#message" ).html( "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">"+
                    "<p class=\"text text-center\">FAILED!: "+data.message+" Please Try Again.</p>"+
                    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                    "<span aria-hidden=\"true\">&times;</span></button>"+
                    "</div>" );
                    document.getElementsByClassName("spinner-border")[0].style.display = "none";
            }
        }).catch(function(data){
            $( "#message" ).html( "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">"+
            "<p class=\"text text-center\">Error Occured. DO you have internet connection? Kindly retry. If problem persists, contact support</p>"+
            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
            "<span aria-hidden=\"true\">&times;</span></button>"+
        "</div>" );
        document.getElementsByClassName("spinner-border")[0].style.display = "none";
    })
}
