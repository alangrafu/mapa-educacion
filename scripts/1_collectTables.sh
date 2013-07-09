#!/bin/bash

for i in `cat idcomunas`; do
  echo Downloading $i...
  curl -XPOST -d"region=13&comuna=$i" http://www.mime.mineduc.cl/index.php/mime/listado_comunal_basica/ > $i.html
done
