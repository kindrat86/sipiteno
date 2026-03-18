import { useState } from "react";
import { projects, Project } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

const ProjectsTable = () => {
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const industries = Array.from(new Set(projects.map(p => p.industry)));
  
  const filteredProjects = projects.filter(project => {
    const matchesIndustry = industryFilter === "all" || project.industry === industryFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesIndustry && matchesStatus;
  });

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            MicroSaaS Projects Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Successful development projects across diverse industries
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-lg border-2 border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Project Name</TableHead>
                <TableHead className="font-bold">Industry</TableHead>
                <TableHead className="font-bold">Technology Stack</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map(project => (
                <TableRow key={project.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold">{project.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.industry}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {project.technology}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        project.status === "Completed" 
                          ? "bg-success text-white" 
                          : "bg-secondary text-white"
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-card border-2 border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{project.name}</h3>
                <Badge 
                  className={
                    project.status === "Completed" 
                      ? "bg-success text-white" 
                      : "bg-secondary text-white"
                  }
                >
                  {project.status}
                </Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Industry:</span>
                  <Badge variant="outline">{project.industry}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold">Tech:</span> {project.technology}
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedProject(project)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </div>
          ))}
        </div>

        {/* Project Details Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                {selectedProject?.name}
                <Badge 
                  className={
                    selectedProject?.status === "Completed" 
                      ? "bg-success text-white" 
                      : "bg-secondary text-white"
                  }
                >
                  {selectedProject?.status}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                <Badge variant="outline" className="mt-2">{selectedProject?.industry}</Badge>
              </DialogDescription>
            </DialogHeader>
            
            {selectedProject && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Technology Stack</h4>
                  <p className="text-muted-foreground">{selectedProject.technology}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedProject.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Challenges</h4>
                  <p className="text-muted-foreground">{selectedProject.challenges}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Solution</h4>
                  <p className="text-muted-foreground">{selectedProject.solution}</p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Results</h4>
                  <p className="text-muted-foreground">{selectedProject.results}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ProjectsTable;
