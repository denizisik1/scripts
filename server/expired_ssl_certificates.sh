# Warning: For use in servers only.

# Directly paste this script into a terminal.
find /home -type f \
  \( -iname "*.crt" -o -iname "*.pem" -o -iname "*.cer" -o -iname "*.cert" \) \
  2>/dev/null |
while read -r cert; do
    if ! grep -q "BEGIN CERTIFICATE" "$cert" 2>/dev/null; then
        continue
    fi

    end_date=$(openssl x509 -enddate -noout -in "$cert" 2>/dev/null | cut -d= -f2)
    [ -z "$end_date" ] && continue

    end_epoch=$(date -d "$end_date" +%s 2>/dev/null) || continue
    now_epoch=$(date +%s)
    five_days_ago=$((now_epoch - 5*24*3600))

    if [ "$end_epoch" -le "$now_epoch" ] && [ "$end_epoch" -ge "$five_days_ago" ]; then
        echo "EXPIRED (last 5 days): $cert"
        echo "  Expired on: $end_date"
    fi
done
