# -*- coding: utf-8 -*-

# python joinColegios.py ../datos/Establecimiento_Matricula_anio_2013.csv ../datos/fichasColegios.csv  ../datos/finales_coordenadas.txt > ../www/datos.csv

import sys,os
import difflib

cooFile=sys.argv[1]
fichaFile=sys.argv[2]
comunasFile=sys.argv[3]

class Colegio:
	def __init__(self, nombre):
		self.nombre=nombre
		self.lat=0.0
		self.lon=0.0
		self.comuna="UNK"
		self.simce="UNK"
		self.rango="UNK"
		self.tipo="UNK"
	def __str__(s):
		return ",".join( (s.nombre,s.comuna,str(s.lon),str(s.lat),
			s.simce, s.rango,s.tipo) )


# get coos for comunas
comLon=dict()
comLat=dict()
nombresComunas=set()
for line in open(comunasFile):
	if line.startswith('#'): continue
	elems=line[:-1].split('\t')
	nom=elems[0].upper()
	comLon[nom]=float(elems[1])
	comLat[nom]=float(elems[2])
	nombresComunas.add(nom)

# get coos for schools
allColegios=dict()

for line in open(cooFile):
	elems=line.split(',')
	if elems[5] != "METROPOLITANA DE SANTIAGO": continue
	nombre=elems[2].strip()
	colegio=Colegio(nombre)
	colegio.lat=float(elems[10])
	colegio.lon=float(elems[11])

	comuna=elems[3]
	if comuna=="?U?OA": comuna="ÑUÑOA"
	colegio.comuna=comuna

	if colegio.lat==0.0 or colegio.lon==0.0:
		best=difflib.get_close_matches(comuna,nombresComunas)
		if len(best)>0:
			translation=best[0]
		else: 
			assert False, "TRANSLATION NOT FOUND"
		colegio.comuna=translation
		colegio.lat=comLat[translation]
		colegio.lon=comLon[translation]

	nombreComuna=nombre+"-"+colegio.comuna
	allColegios[nombreComuna]=colegio

###

listaColegios=allColegios.keys()

for line in open(fichaFile):
	nombre,comuna,simce,_,_,rango,tipo=line[:-1].split(',')
	nombreComuna=nombre+"-"+comuna
	best=difflib.get_close_matches(nombreComuna,listaColegios)
	if len(best)==0: continue
	nom=best[0]
	colegio=allColegios[nom]
	colegio.simce=simce
	colegio.rango=rango
	colegio.tipo=tipo
	print colegio
	
####

#for nom in listaColegios:
#	print allColegios[nom]
