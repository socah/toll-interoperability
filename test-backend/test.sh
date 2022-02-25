#!/bin/bash
echo -e "\n\033[0;31mO Κώδικας που κάνει το testing βρίσκεται στο αρχείο backend/test.js\033[0m"
echo -e "\033[0;31mΤο test.sh είναι απλά ένα bash script\033[0m"

cd ../backend/
npm run test
