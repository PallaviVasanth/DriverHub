from pathlib import Path

path = Path('web/src/pages/employer/EmployerPages.jsx')
text = path.read_text()
text = text.replace('<td className="px-5 py-4 font-semibold">{app.candidate_name}</td>', '<td className="px-5 py-4 font-semibold"><Link className="text-blue-700 hover:underline" to={`/employer/applications/${app.id}`}>{app.candidate_name}</Link></td>')
text = text.replace('<Card key={candidate.id} className="p-5"><h2 className="font-bold">{candidate.name}</h2>', '<Card key={candidate.id} className="p-5"><Link to={`/employer/candidates/${candidate.id}`} className="font-bold text-blue-700 hover:underline">{candidate.name}</Link>')
path.write_text(text)
