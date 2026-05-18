import {useCallback, useMemo, useState} from "react";
import {useClient, useDocumentOperation} from "sanity";
import type {DocumentActionComponent} from "sanity";

function getBaseId(id: string) {
  return id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
}

export const publishedAtPublishAction: DocumentActionComponent = (props) => {
  const client = useClient({apiVersion: "2025-01-01"});
  const baseId = useMemo(() => getBaseId(props.id), [props.id]);
  const {publish} = useDocumentOperation(baseId, props.type);

  const [isPublishing, setIsPublishing] = useState(false);

  const onHandle = useCallback(async () => {
    if (isPublishing) return;
    setIsPublishing(true);

    try {
      const currentPublishedAt = (props.draft as any)?.publishedAt ?? (props.published as any)?.publishedAt;
      if (!currentPublishedAt) {
        await client
          .patch(`drafts.${baseId}`)
          .setIfMissing({publishedAt: new Date().toISOString()})
          .commit({autoGenerateArrayKeys: true});
      }

      publish.execute();
      props.onComplete();
    } finally {
      setIsPublishing(false);
    }
  }, [baseId, client, isPublishing, props, publish]);

  if (props.type !== "article" && props.type !== "property") return null;

  return {
    label: "Publish",
    disabled: isPublishing || Boolean(publish.disabled),
    onHandle
  };
};

(publishedAtPublishAction as any).action = "publish";
