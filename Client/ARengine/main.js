class Engine{
    static loadTemplate(template_id, data){
        var template = document.getElementById(template_id).innerHTML;
        var temp = eval('`' + template + '`')
        return temp;
    }
    static run(id, data){
        var html = "";
        data.forEach((element, key) => {
            html += this.loadTemplate(id,data[key]);
        });
        return html;
    }


}

export default{
    En:Engine,
}