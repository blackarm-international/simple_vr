
# eslint
echo
echo "check client.ts with airbnb eslint"
if npx eslint client.ts
then
  echo "done"
else
  exit
fi
echo


# transpile typescript
echo "transpiling client.ts"
if tsc
then
  echo "done"
else
  exit
fi

# # clean up client.js
# grep -Ev 'use strict|ts-ignore' < client.js | sed 's/    /  /g' > clean.js
# mv clean.js client.js

# # build test.html
# cat source.html > ../test.html
# sed 's/^/      /' < client.js >> ../test.html
# echo '    </script>' >> ../test.html
# echo '  </body>' >> ../test.html
# echo '</html>' >> ../test.html
# echo
