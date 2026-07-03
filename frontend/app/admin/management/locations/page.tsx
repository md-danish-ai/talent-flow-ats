"use client";

import React, { useState } from "react";
import { Search, MapPin, Map, Loader2, Plus, Edit2 } from "lucide-react";
import { Input } from "@components/ui-elements/Input";
import { Button } from "@components/ui-elements/Button";
import { useStates, useDistrictsByState } from "@hooks/useLocations";
import { DistrictModal } from "./components/DistrictModal";
import { District } from "@lib/api/locations";

export default function LocationsManagementPage() {
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);

  const { data: states = [], isLoading: isStatesLoading } = useStates();
  const { data: districts = [], isLoading: isDistrictsLoading } =
    useDistrictsByState(selectedStateId);

  const handleAddDistrict = () => {
    setEditingDistrict(null);
    setIsModalOpen(true);
  };

  const handleEditDistrict = (district: District) => {
    setEditingDistrict(district);
    setIsModalOpen(true);
  };

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase()),
  );

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(districtSearch.toLowerCase()),
  );

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
        <p className="text-muted-foreground">
          View all States and their corresponding Districts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Pane: States */}
        <div className="md:col-span-4 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-brand-primary" />
              States ({states.length})
            </h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search states..."
                className="pl-9 bg-background"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            {isStatesLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStates.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No states found.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredStates.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => {
                      setSelectedStateId(state.id);
                      setDistrictSearch("");
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${selectedStateId === state.id
                      ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                      : "hover:bg-muted text-foreground border border-transparent"
                      }`}
                  >
                    <span className="font-medium text-sm">{state.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${selectedStateId === state.id
                        ? "bg-brand-primary/20"
                        : "bg-muted-foreground/10 text-muted-foreground"
                        }`}
                    >
                      {state.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Districts */}
        <div className="md:col-span-8 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
          {selectedStateId ? (
            <>
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-primary" />
                    Districts ({districts.length})
                  </h2>
                  <Button size="sm" onClick={handleAddDistrict} color="primary" className="h-8">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search districts..."
                    className="pl-9 bg-background"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                {isDistrictsLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredDistricts.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    No districts found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredDistricts.map((district) => (
                      <div
                        key={district.id}
                        className="p-3 bg-background border border-border rounded-lg shadow-sm hover:border-brand-primary/40 transition-colors flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-brand-primary" />
                          </div>
                          <span
                            className="text-sm font-medium truncate"
                            title={district.name}
                          >
                            {district.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleEditDistrict(district)}
                          className="p-1.5 text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 transition-colors rounded-md shrink-0"
                          title="Edit District"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedStateId && (
                <DistrictModal
                  isOpen={isModalOpen}
                  onClose={() => {
                    setIsModalOpen(false);
                    setEditingDistrict(null);
                  }}
                  stateId={selectedStateId}
                  stateName={states.find(s => s.id === selectedStateId)?.name || ""}
                  existingDistrict={editingDistrict}
                />
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <Map className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No State Selected</p>
              <p className="text-sm opacity-70 max-w-md mt-1">
                Please select a state from the left panel to view its
                corresponding districts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
