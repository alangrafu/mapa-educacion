#!/bin/bash
IFS=''

rm all.csv

cd csv
cat *.csv |grep -v "\"" >> ../all.csv

