# Warning: Don'u use this on your personal computer since it is not tested well, can have side effects.

# Can be added to the bottom of ~/.bashrc
# After sourcing write echo 1 to test if it works.

if [[ $- == *i* ]]; then
  trap '__mysql_warn_hook' DEBUG
fi

__mysql_warn_hook() {
  [[ -z "$BASH_COMMAND" ]] && return

  local cmd="$(echo "$BASH_COMMAND" | sed -E 's/[[:space:]]+/ /g')"
  case "$cmd" in
    "sudo systemctl start mysql"|"sudo systemctl stop mysql"|"echo 1")
      echo -e "\033[1;33m[WARNING]\033[0m Don't forget to adjust max_connections"
      ;;
  esac
}
