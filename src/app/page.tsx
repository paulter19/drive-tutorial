"use client"

import { useState } from "react"
import { Folder, File, Upload, ChevronRight, Home } from "lucide-react"
import { Button } from "~/components/ui/button"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  url?: string
  children?: FileItem[]
  modifiedDate: string
  size?: string
}

const mockData: FileItem[] = [
  {
    id: "1",
    name: "Projects",
    type: "folder",
    modifiedDate: "2025-01-15",
    children: [
      {
        id: "1-1",
        name: "Website Redesign",
        type: "folder",
        modifiedDate: "2025-01-14",
        children: [
          {
            id: "1-1-1",
            name: "design-mockup.figma",
            type: "file",
            url: "https://figma.com/design-mockup",
            modifiedDate: "2025-01-14",
            size: "2.4 MB",
          },
          {
            id: "1-1-2",
            name: "requirements.pdf",
            type: "file",
            url: "https://example.com/requirements.pdf",
            modifiedDate: "2025-01-12",
            size: "1.2 MB",
          },
        ],
      },
      {
        id: "1-2",
        name: "Mobile App",
        type: "folder",
        modifiedDate: "2025-01-10",
        children: [
          {
            id: "1-2-1",
            name: "app-prototype.xd",
            type: "file",
            url: "https://example.com/app-prototype.xd",
            modifiedDate: "2025-01-10",
            size: "3.1 MB",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Documents",
    type: "folder",
    modifiedDate: "2025-01-16",
    children: [
      {
        id: "2-1",
        name: "Q1 Report.docx",
        type: "file",
        url: "https://example.com/q1-report.docx",
        modifiedDate: "2025-01-16",
        size: "850 KB",
      },
      {
        id: "2-2",
        name: "Meeting Notes.txt",
        type: "file",
        url: "https://example.com/meeting-notes.txt",
        modifiedDate: "2025-01-15",
        size: "45 KB",
      },
    ],
  },
  {
    id: "3",
    name: "presentation.pptx",
    type: "file",
    url: "https://example.com/presentation.pptx",
    modifiedDate: "2025-01-13",
    size: "5.2 MB",
  },
]

function getCurrentFolderContents(data: FileItem[], path: string[]): FileItem | null {
  let current: any = { children: data }
  for (const id of path) {
    const found = current.children?.find((item: FileItem) => item.id === id)
    if (!found) return null
    current = found
  }
  return current
}

export default function DriveClone() {
  const [currentPath, setCurrentPath] = useState<string[]>([])

  const currentFolder = getCurrentFolderContents(mockData, currentPath)
  const items = currentFolder?.children || mockData

  const handleOpenFolder = (folderId: string) => {
    setCurrentPath([...currentPath, folderId])
  }

  const handleNavigateTo = (index: number) => {
    setCurrentPath(currentPath.slice(0, index))
  }

  const handleGoHome = () => {
    setCurrentPath([])
  }

  const breadcrumbs = [
    { id: null, name: "My Drive" },
    ...currentPath.map((id) => {
      let current: any = { children: mockData }
      for (const pathId of currentPath.slice(0, currentPath.indexOf(id) + 1)) {
        const found = current.children?.find((item: FileItem) => item.id === pathId)
        if (found) current = found
      }
      return { id, name: current.name }
    }),
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              G
            </div>
            <h1 className="text-2xl font-bold text-foreground">Drive</h1>
          </div>
          <Button className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>

        <nav className="border-t border-border bg-background px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <button
              onClick={handleGoHome}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id || "home"} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-foreground font-medium">{crumb.name}</span>
                ) : (
                  <button
                    onClick={() => handleNavigateTo(index)}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    {crumb.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">This folder is empty</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors cursor-pointer group"
                onClick={() => {
                  if (item.type === "folder") {
                    handleOpenFolder(item.id)
                  }
                }}
              >
                <div className="flex-shrink-0">
                  {item.type === "folder" ? (
                    <Folder className="w-5 h-5 text-blue-500" />
                  ) : (
                    <File className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <a
                  href={item.type === "file" ? item.url : undefined}
                  target={item.type === "file" ? "_blank" : undefined}
                  rel={item.type === "file" ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (item.type === "file") {
                      e.stopPropagation()
                    }
                  }}
                  className="flex-1 min-w-0"
                >
                  <h3 className="font-semibold text-foreground truncate group-hover:text-blue-500 transition-colors">
                    {item.name}
                  </h3>
                </a>
                <div className="flex-shrink-0 flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="w-20 text-right">{item.type === "folder" ? "Folder" : item.size}</span>
                  <span className="w-24 text-right">{item.modifiedDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
