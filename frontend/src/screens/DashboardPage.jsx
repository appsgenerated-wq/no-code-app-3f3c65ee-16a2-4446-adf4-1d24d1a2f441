import React, { useEffect, useState } from 'react';
import config from '../constants.js';
import { BeakerIcon, BookOpenIcon, ChevronDownIcon, DocumentPlusIcon, PhotoIcon, PlusIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Feature-Aware Component: ImageUploader
const ImageUploader = ({ onFileSelect, preview, onClear }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (files) => {
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">Subject Photo</label>
        <div 
            className={`mt-2 flex justify-center rounded-lg border border-dashed transition-colors ${dragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-900/25'} px-6 py-10`}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files); }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
        >
        {preview ? (
            <div className="relative">
                <img src={preview} alt="Preview" className="h-32 w-auto rounded-md" />
                <button type="button" onClick={onClear} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        ) : (
            <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
            </div>
        )}
        </div>
    </div>
  );
};

// Feature-Aware Component: ChoiceSelector
const ChoiceSelector = ({ label, options, selected, onSelect, colors }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex flex-wrap gap-2 mt-2">
            {options.map(option => (
                <button
                    type="button"
                    key={option}
                    onClick={() => onSelect(option)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${selected === option ? (colors?.[option] || 'bg-indigo-600 text-white') : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                {option}
                </button>
            ))}
            </div>
        </div>
    );
};

// Feature-Aware Component: RelationshipPicker
const RelationshipPicker = ({ manifest, entityName, label, onSelect, selectedId }) => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const loadItems = async () => {
            const response = await manifest.from(entityName).find({ limit: 100 });
            setItems(response.data);
            if(selectedId) {
                const foundItem = response.data.find(item => item.id === selectedId);
                if(foundItem) setSelectedItem(foundItem);
            }
        };
        loadItems();
    }, [manifest, entityName, selectedId]);

    const handleSelection = (e) => {
        const itemId = e.target.value;
        const item = items.find(i => i.id === itemId);
        onSelect(itemId);
        setSelectedItem(item);
    }

    return (
        <div>
            <label htmlFor={entityName} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <select id={entityName} name={entityName} onChange={handleSelection} value={selectedId || ''} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <option value="">Select a {label}</option>
                {items.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                ))}
            </select>
        </div>
    )
}

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({ title: '', details: '', logType: 'Behavioral', projectId: '', subjectPhoto: null, gravityReading: 9.8 });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [newProject, setNewProject] = useState({ name: '', description: '', status: 'Planning' });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const projectResponse = await manifest.from('Project').find({ include: ['leadScientist'], sort: { createdAt: 'desc' }});
    setProjects(projectResponse.data);
    const logResponse = await manifest.from('ObservationLog').find({ include: ['observer', 'project'], sort: { observationDate: 'desc' } });
    setLogs(logResponse.data);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
        await manifest.from('Project').create({ ...newProject, leadScientistId: user.id });
        setNewProject({ name: '', description: '', status: 'Planning' });
        setShowProjectForm(false);
        loadData();
    } catch(error) {
        alert(`Error creating project: ${error.message}`);
    }
  };

  const handleCreateLog = async (e) => {
    e.preventDefault();
    try {
        await manifest.from('ObservationLog').create({ 
            ...newLog,
            observerId: user.id,
            observationDate: new Date().toISOString()
        });
        setNewLog({ title: '', details: '', logType: 'Behavioral', projectId: '', subjectPhoto: null, gravityReading: 9.8 });
        setPhotoPreview(null);
        setShowLogForm(false);
        loadData();
    } catch(error) {
        alert(`Error creating log: ${error.message}`);
    }
  };
  
  const handlePhotoSelect = (file) => {
    setNewLog({...newLog, subjectPhoto: file});
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BeakerIcon className="h-8 w-8 text-indigo-600"/>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Lunar Research Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name} ({user.role})</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Admin Panel</a>
            <button onClick={onLogout} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ROLE-BASED UI: Project Creation */}
        {user.role === 'LeadScientist' && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
                    <button onClick={() => setShowProjectForm(!showProjectForm)} className="p-1 rounded-full hover:bg-gray-200">
                        <ChevronDownIcon className={`h-6 w-6 transition-transform ${showProjectForm ? 'rotate-180' : ''}`}/>
                    </button>
                </div>
                {showProjectForm && (
                <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
                    <input type="text" placeholder="Project Name" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required className="w-full p-2 border rounded-md"/>
                    <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full p-2 border rounded-md"/>
                    <ChoiceSelector label="Status" options={['Planning', 'Active', 'Completed', 'OnHold']} selected={newProject.status} onSelect={status => setNewProject({...newProject, status})}/>
                    <button type="submit" className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"><PlusIcon className="h-5 w-5"/>Add Project</button>
                </form>
                )}
            </div>
        )}

        {/* Observation Log Creation Form */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Create New Observation Log</h2>
                <button onClick={() => setShowLogForm(!showLogForm)} className="p-1 rounded-full hover:bg-gray-200">
                    <ChevronDownIcon className={`h-6 w-6 transition-transform ${showLogForm ? 'rotate-180' : ''}`}/>
                </button>
            </div>
            {showLogForm && (
                <form onSubmit={handleCreateLog} className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="text" placeholder="Log Title" value={newLog.title} onChange={e => setNewLog({...newLog, title: e.target.value})} required className="w-full p-2 border rounded-md md:col-span-2"/>
                      <textarea placeholder="Details of Observation" value={newLog.details} onChange={e => setNewLog({...newLog, details: e.target.value})} className="w-full p-2 border rounded-md md:col-span-2" rows="4"/>
                      <RelationshipPicker manifest={manifest} entityName="Project" label="Project" selectedId={newLog.projectId} onSelect={id => setNewLog({...newLog, projectId: id})}/>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gravity Reading (m/s²)</label>
                        <input type="number" step="0.01" value={newLog.gravityReading} onChange={e => setNewLog({...newLog, gravityReading: parseFloat(e.target.value)})} className="w-full p-2 border rounded-md mt-2"/>
                      </div>
                      <div className="md:col-span-2">
                        <ChoiceSelector label="Log Type" options={['Behavioral', 'Environmental', 'PhysicsExperiment']} selected={newLog.logType} onSelect={type => setNewLog({...newLog, logType: type})}/>
                      </div>
                      <div className="md:col-span-2">
                        <ImageUploader onFileSelect={handlePhotoSelect} preview={photoPreview} onClear={() => {setPhotoPreview(null); setNewLog({...newLog, subjectPhoto: null})}} />
                      </div>
                    </div>
                    <button type="submit" className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"><DocumentPlusIcon className="h-5 w-5"/>Submit Log</button>
                </form>
            )}
        </div>

        {/* Data Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Projects</h3>
                {projects.length > 0 ? projects.map(p => (
                    <div key={p.id} className="p-4 bg-white rounded-lg shadow">
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                        <div className="text-xs mt-3 flex justify-between items-center">
                           <span className={`px-2 py-1 rounded-full ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{p.status}</span>
                           <span className="text-gray-500 flex items-center gap-1"><UserCircleIcon className="h-4 w-4"/> {p.leadScientist?.name || 'N/A'}</span>
                        </div>
                    </div>
                )) : <p className="text-gray-500">No projects found.</p>}
            </div>
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Observation Logs</h3>
                {logs.length > 0 ? logs.map(l => (
                    <div key={l.id} className="p-4 bg-white rounded-lg shadow flex gap-4">
                        {l.subjectPhoto?.thumbnail && <img src={l.subjectPhoto.thumbnail} alt={l.title} className="w-24 h-24 object-cover rounded-md"/>}
                        <div>
                            <p className="font-bold text-gray-900">{l.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{l.details}</p>
                            <div className="text-xs mt-3 flex flex-wrap gap-x-4 gap-y-2 text-gray-500">
                                <span>Project: {l.project?.name || 'N/A'}</span>
                                <span>Gravity: {l.gravityReading} m/s²</span>
                                <span>Type: {l.logType}</span>
                                <span>By: {l.observer?.name || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-gray-500">No logs recorded yet.</p>}
            </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
