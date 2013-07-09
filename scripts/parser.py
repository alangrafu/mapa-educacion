from BeautifulSoup import BeautifulSoup
import sys
import re
import csv
import cStringIO
import codecs


class UnicodeWriter:
    """
    A CSV writer which will write rows to CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
        self.writer.writerow([s.encode("utf-8") for s in row])
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)

html = open(sys.argv[1]).read()
print sys.argv[1]
soup = BeautifulSoup(html)

tables = soup.findAll("table")
comuna = "".join(tables[1].find("tr").find("td").find("p").findAll(text=True))
comunaName = re.sub(r' \w+: ', '', comuna)

escuelas = tables[6].findAll("tr")
print comunaName
with open('csv/'+comunaName+'.csv', 'wb') as f:
  writer = UnicodeWriter(f)
  counter = 0
  for e in escuelas:
    counter += 1
    datos = e.findAll("td")
    linea = []
    a = datos[1].find("a")
    linea.append(re.sub(r'&nbsp;', '',a.find(text=True)))
    linea.append(comunaName)
    #print datos[2].find(text=True)
    linea.append(re.sub(r'&nbsp;', '',datos[2].find(text=True)))
    if datos[3] is None:
      linea.append(datos[3].find(text=True))
    else:
      linea.append("")
    linea.append(re.sub(r'&nbsp;', '',datos[4].find(text=True)))
    linea.append(re.sub(r'&nbsp; ', '',datos[5].find(text=True)))
    linea.append(re.sub(r'&nbsp;', '',datos[6].find(text=True)))
    writer.writerow(linea)    



