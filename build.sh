
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

cp imports.js temp.js
cat client.js >> temp.js
mv temp.js client.js