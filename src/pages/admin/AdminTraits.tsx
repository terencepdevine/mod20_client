import React from "react";
import { useParams, Link } from "react-router-dom";

import { useSystem } from "../../hooks/useProvider";
import { useTraits } from "../../hooks/useTraits";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import ContentTitle from "../../components/ContentTitle/ContentTitle";
import Loading from "../../components/Loading/Loading";

const AdminTraits: React.FC = () => {
  const { systemSlug } = useParams<{ systemSlug: string }>();
  const {
    data: system,
    isPending: systemPending,
    isError: systemError,
    error: systemErrorMessage,
  } = useSystem();

  const {
    data: traits,
    isPending: traitsPending,
    isError: traitsError,
    error: traitsErrorMessage,
  } = useTraits(system?.id);

  // Loading states
  if (systemPending) {
    return <Loading message="Loading system..." className="content-wrap" />;
  }

  if (systemError && systemErrorMessage !== null) {
    return (
      <div className="content-wrap">
        <div className="error-message">
          Error: {systemErrorMessage.message || "Something went wrong"}
        </div>
      </div>
    );
  }

  if (!system) {
    return (
      <div className="content-wrap">
        <div className="error-message">System not found</div>
      </div>
    );
  }

  return (
    <div className="content-wrap">
      <ContentTitle
        systemSlug={systemSlug}
        sectionType="traits"
        entityType="trait"
      >
        Traits
      </ContentTitle>

      <Card>
        <div className="admin-list">
          <div className="admin-list__header">
            <h3>Manage Traits</h3>
            <Link to={`/admin/systems/${systemSlug}/traits/new`}>
              <Button variant="primary" size="sm">
                Create New Trait
              </Button>
            </Link>
          </div>

          {traitsPending && <Loading message="Loading traits..." />}

          {traitsError && traitsErrorMessage && (
            <div className="error-message">
              Error loading traits:{" "}
              {traitsErrorMessage.message || "Something went wrong"}
            </div>
          )}

          {traits && traits.length === 0 && (
            <div className="admin-list__empty">
              <p>No traits found for this system.</p>
              <Link to={`/admin/systems/${systemSlug}/traits/new`}>
                <Button variant="primary" size="sm">
                  Create Your First Trait
                </Button>
              </Link>
            </div>
          )}

          {traits && traits.length > 0 && (
            <div className="admin-list__items">
              {traits.map((trait) => (
                <div key={trait.id} className="admin-list__item">
                  <div className="admin-list__item-info">
                    <h4 className="admin-list__item-title">
                      <Link
                        to={`/admin/systems/${systemSlug}/traits/${trait.slug}`}
                      >
                        {trait.name}
                      </Link>
                    </h4>
                    {trait.description && (
                      <div
                        className="admin-list__item-description"
                        dangerouslySetInnerHTML={{ __html: trait.description }}
                      />
                    )}
                  </div>
                  <div className="admin-list__item-actions">
                    <Link
                      to={`/admin/systems/${systemSlug}/traits/${trait.slug}`}
                    >
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminTraits;
