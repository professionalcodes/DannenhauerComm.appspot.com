
<#
 * One of the best things about windows is windows powershell. Everyone is talking about it. I'm becoming a master at it
 * There are obviously many advantages of having a unix based system but truth is windows powershell is more advanced and 
 * More powerful than the unix or linux terminal.
 * This file just turns the gulp delete minified file functions into powershell functions.
#>
$app_paths = @{
    templates_root              = "templates/";
    index_html                  = "templates/index.html";
    js_file_path                = "static/js/*.js";
    css_file_ath                = "static/css/*.css";
    views_file_path             = "static/views/*.html";
    min_js_file_path 			      = "static/js/*.min.js";
    min_css_file_path           = "static/css/*.min.css";
    destination_jsmin_filepath 	= "static/js/site.min.js";
    destination_cssmin_filepath = "static/css/site.min.css"
}

function delete_minified_js_files {
    rm $app_paths.min_js_file_path
}

function delete_minified_css_files {
    rm $app_paths.min_css_file_path
}

function run_gulp_task($task_name) {
    gulp $task_name
}

<# Obviously runs the default task #>
function run_gulp_default {
    gulp
}

function run_all_tasks($gulp_task_args) {
    $gulp_task_args | foreach {
        gulp $_
    }
}

<# perhaps show some git information #>
function show_git_information {
  write (git config user.name)
  write (git config user.email)
}

<# Opens up a config file to edit git info like in a notepad file outside of the terminal #>
function open_git_config {
  git config --global --edit
}

<# FInish Me #>
function find_processes_with_increasing_cpu_usage([int]$num_seconds_to_minitor_processes, [int]$num_seconds_to_wait) {
  while (1) {
    $current_processes_cpu_usage = get_current_processes_cpu_usage
    start-sleep $num_seconds_to_wait
    $current_processes_cpu_usage
  }
}

function get_current_processes_cpu_usage() {
  return (gps | foreach {
    $_.cpu
  })
}


function ps_function_exists_in_scope([String]$function_name) {
  $exists = (ls function:).where{$_.name -eq $function_name}
  return $exists -ne $null
}

<#
1. Navigate into your gae app dir, and npm install 
2. load in the powershell script with the command " . powershell_utils.ps1 "
3. run gae dev_server with the command " start_gae_devserver (pwd) "
4. put the app online with the command " update_gae_app (pwd) "
#>



<#
  You can also combine named elements with a range, separating them with a +
  so $myArray[1,2+4..9] will return the elements at indices 1 and 2 and then 4 through 9 inclusive.
#>