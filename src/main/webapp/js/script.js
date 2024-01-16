var accData;
let count;
let pageCount;
let currentPage=0;
var selected;
let races = ['HUMAN', 'DWARF', 'ELF', 'GIANT', 'ORC', 'TROLL', 'HOBBIT'];
let professions = ['WARRIOR', 'ROGUE', 'SORCERER', 'CLERIC', 'PALADIN', 'NAZGUL', 'WARLOCK', 'DRUID'];
let bans = ['true', 'false'];

function goToPage(pageNumber) {
    currentPage=pageNumber;
    $('.deletable').remove();
    $('.second_deletable').remove();
    $("document").ready(drawPage)
}
function panelDraw(pageSize) {
    let str='';

    for (let i = 1; i <= pageSize; i++) {
        let fun = "'goToPage("+ (i-1) +")'";
        if(i===(currentPage+1)) {
            $('#page_count').append("<button class='button-28 deletable' disabled>" + i.toString() + "</button>");
        } else {
            $('#page_count').append("<button class='button-28 deletable' onclick=" + fun +">" + i.toString() + "</button>");
        }
    }
}
function drawPage () {
    $.get({url: '/rest/players/count',success: function (data) { count = data; }});
            var e = document.getElementById("id_count");
            selected = e.options[e.selectedIndex].text;
        $.ajax({type: "GET", url: `/rest/players?pageNumber=${currentPage}&pageSize=${selected}`}).then(function (data) {
        accData = data;
        for (var dataKey in data) {
            let d = new Date(data[dataKey].birthday);
            let date = d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear();
            let id = data[dataKey].id;
            let row_id= "id = \"row_id_"+id+"\"";
            let element_id = "id = \"element_id_"+id+"\"";
            let img_id = "id = \"img_id_"+id+"\"";

            $("#mtable").append("<tr "+row_id+" class='second_deletable'>" +
                "<td "+element_id+" class='table_td deletable id'>" + data[dataKey].id + "</td>" +
                "<td "+element_id+" class='table_td deletable name'>" + data[dataKey].name + "</td>" +
                "<td "+element_id+" class='table_td deletable title'>" + data[dataKey].title + "</td>" +
                "<td "+element_id+" class='table_td deletable race'>" + data[dataKey].race + "</td>" +
                "<td "+element_id+" class='table_td deletable profession'>" + data[dataKey].profession + "</td>" +
                "<td "+element_id+" class='table_td deletable level'>" + data[dataKey].level + "</td>" +
                "<td "+element_id+" class='table_td deletable date'>" + date + "</td>" +
                "<td "+element_id+" class='table_td deletable banned'>" + data[dataKey].banned + "</td>" +
                "<td "+element_id+" class='table_td deletable img_edit'><img "+img_id+" src=\"../img/edit.png\" alt=\"edit\" onclick=\"editElement("+id+")\"></td>" +
                "<td "+element_id+" class='table_td deletable img_delete'><img "+img_id+" class = \"delete_class\""+" src=\"../img/delete.png\" alt=\"delete\" onclick=\"removeElement("+id+")\"></td>");
        }
        pageCount = Math.ceil(count/selected);
        panelDraw(pageCount);
    });
}
$('document').ready(drawPage)
function removeElement(id){
    let str = "/rest/players/"+id.toString();
    $.ajax({url: str,
        type: "DELETE"
    }).then(function () {
        goToPage(currentPage);
    });
}
function editElement(id) {
    let img_id = "img_id_"+id.toString();
    let element_id = "element_id_"+id.toString();
    $("#"+img_id).remove();
    $("#"+img_id).remove();
    $("#"+element_id+".img_edit").append("<img "+"id=\""+img_id+"\" src=\"../img/save.png\" alt=\"save\" onclick=\"saveElement("+id+")\">");
    redrawEditedElements(id);
}
function redrawEditedElements(id) {
    let element_id = "element_id_"+id.toString();
    name = $("#"+element_id+".name").text();
    title = $("#"+element_id+".title").text();
    race =  $("#"+element_id+".race").text();
    profession = $("#"+element_id+".profession").text();
    banned = $("#"+element_id+".banned").text();
    $("#"+element_id+".name").html("<input id=\""+element_id+"\" class='name_class' value=\""+name+"\"/>");
    $("#"+element_id+".title").html("<input id=\""+element_id+"\" class='title_class' value=\""+title+"\"/>");
    $("#"+element_id+".race").html(getRaceString(race));
    $("#"+element_id+".profession").html(getProfessionString(profession));
    $("#"+element_id+".banned").html(getBannedString(banned));
}
function getRaceString(race) {
    let result = "<select name=\"race_name\" id=\"race_id\" class=\"race_class\">";
    for (var racesKey in races) {
        if (race===races[racesKey]) {
            result = result + "<option value=\""+races[racesKey]+"\" selected=\"selected\">"+races[racesKey]+"</option>"
        } else {
            result = result + "<option value=\""+races[racesKey]+"\">"+races[racesKey]+"</option>"
        }
    }
    result += "</select>"
    return result;
}
function getProfessionString(profession) {
    let result = "<select name=\"profession_name\" id=\"profession_id\" class=\"profession_class\">";
    for (var professionKey in professions) {
        if (profession===professions[professionKey]) {
            result = result + "<option value=\""+professions[professionKey]+"\" selected=\"selected\">"+professions[professionKey]+"</option>"
        } else {
            result = result + "<option value=\""+professions[professionKey]+"\">"+professions[professionKey]+"</option>"
        }
    }
    result += "</select>"
    return result;
}
function getBannedString(banned) {
    let result = "<select name=\"banned_name\" id=\"banned_id\" class=\"banned_class\">";
    for (var bannedKey in bans) {
        if (banned===bans[bannedKey]) {
            result = result + "<option value=\""+bans[bannedKey]+"\" selected=\"selected\">"+bans[bannedKey]+"</option>"
        } else {
            result = result + "<option value=\""+bans[bannedKey]+"\">"+bans[bannedKey]+"</option>"
        }
    }
    result += "</select>"
    return result;
}
function saveElement(id) {
    let element_id = "element_id_"+id.toString();
    name = $(".name_class").val();
    title = $(".title_class").val();
    race = $(".race_class").val();
    profession = $(".profession_class").val();
    banned = $(".banned_class").val();
    let result = JSON.stringify({name:name, title: title, race: race, profession: profession, banned: banned});
    let addr = "/rest/players/"+id.toString();
    $.ajax({url: addr,
        type: "POST",
        data: result,
        success: function () {
            goToPage(currentPage);
        },
        contentType: "application/json",
        dataType: 'json'
    });
}
function addElement() {
    let name = $("#add_name").val();
    let title = $("#add_title").val();
    let race = $("#add_race").val();
    let profession = $("#add_profession").val();
    let level = $("#add_level").val();
    let dates = $("#add_date").val();
    let dateUnformated = new Date(dates);
    let dateFomated = Math.floor(dateUnformated.getTime());
    banned = $("#add_banned").val();
    let result = JSON.stringify({name:name, title: title, race: race, profession: profession, banned: banned, level: level, birthday: dateFomated});
    let addr = "/rest/players";
    //prompt("123",result);
    $.ajax({url: addr,
        type: "POST",
        data: result,
        success: function () {
            $("#add_name").val("");
            $("#add_title").val("");
            $("#add_level").val("");
            $("#add_banned").val("false");
            $("#add_race").val("HUMAN");
            $("#add_profession").val("WARRIOR");
            goToPage(currentPage);

        },
        contentType: "application/json",
        dataType: 'json'
    });
}