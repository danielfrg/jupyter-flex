// Terminal CSS
// Iterate all the items that start with id=__code

var pre_tags = document.getElementsByTagName("pre")
// // Iterate all pre tags
for(var i = 0; i < pre_tags.length; i++) {
    var target_block = pre_tags[i];

    // For Jupyter Notebooks the code is under <code> tags
    var code_block = target_block.getElementsByTagName("code")[0];
    if (code_block) {
        target_block = code_block;
    }

    // Modify the text to encapsulate ($,>,>>>) within span tags
    var terminal_regex = "^(<span></span>)?(<code>)?\\$ ";
    var r_console_regex = '^(<span></span>)?<span class="o">&gt;</span> ';
    var python_shell_regex = '^(<span></span>)?<span class="o">&gt;&gt;&gt;</span> ';
    regexs = [terminal_regex, r_console_regex, python_shell_regex]
    replacements = ["$", "&gt;", "&gt;&gt;&gt;"]
    for (j in regexs) {
        var regex = regexs[j]
        var replacement = replacements[j]
        var re = new RegExp(regex, "gm");
        var str = target_block.innerHTML;
        str = str.replace(re, "<span class=\"code-noselect\">" + replacement + " </span>");
        target_block.innerHTML = str;
    }
}